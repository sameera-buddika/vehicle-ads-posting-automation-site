# ads_post/verification_service.py
"""
AI-Powered Vehicle Verification Service
Uses OpenAI Vision API to verify vehicle listings
"""
import os
import base64
import json
import logging
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from django.conf import settings
from django.core.files.base import ContentFile
from openai import OpenAI
from .models import Vehicle, VehicleVerificationResult

logger = logging.getLogger(__name__)


class VehicleVerificationService:
    """
    Service class to handle AI-powered vehicle verification
    """
    
    def __init__(self):
        """Initialize OpenAI client with API key from environment"""
        self.api_key = getattr(settings, 'OPENAI_API_KEY', None)
        self.model = getattr(settings, 'OPENAI_MODEL', 'gpt-4o')  # Default to gpt-4o with vision
        
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found in settings")
        
        self.client = OpenAI(api_key=self.api_key)
        
        # Verification thresholds
        self.PASS_THRESHOLD = 70.0  # Overall score threshold for passing
        self.MANUAL_REVIEW_THRESHOLD = 50.0  # Below this, requires manual review
        self.MAX_IMAGES_TO_ANALYZE = 5  # Limit images to reduce API costs
    
    def encode_image_to_base64(self, image_path: str) -> str:
        """Encode image file to base64 string"""
        try:
            with open(image_path, "rb") as image_file:
                return base64.b64encode(image_file.read()).decode('utf-8')
        except Exception as e:
            logger.error(f"Error encoding image {image_path}: {str(e)}")
            raise
    
    def prepare_image_urls(self, vehicle: Vehicle) -> List[str]:
        """
        Prepare image URLs for OpenAI API
        Returns list of base64 encoded images
        """
        images = vehicle.images.all()[:self.MAX_IMAGES_TO_ANALYZE]
        image_data = []
        
        for img in images:
            try:
                # Get the full path of the image
                image_path = img.image.path
                base64_image = self.encode_image_to_base64(image_path)
                image_data.append(f"data:image/jpeg;base64,{base64_image}")
            except Exception as e:
                logger.warning(f"Could not process image {img.id}: {str(e)}")
                continue
        
        return image_data
    
    def build_verification_prompt(self, vehicle: Vehicle) -> str:
        """
        Build detailed prompt for OpenAI to verify vehicle
        """
        prompt = f"""You are an expert vehicle inspector. Analyze the provided vehicle images and verify the listing details.

**User-Provided Vehicle Information:**
- Manufacturer/Brand: {vehicle.manufacturer}
- Model: {vehicle.model}
- Vehicle Type: {vehicle.vehicle_type or 'Not specified'}
- Fuel Type: {vehicle.fuel_type or 'Not specified'}
- Year: {vehicle.year or 'Not specified'}
- Transmission: {vehicle.transmission or 'Not specified'}

**Your Task:**
1. Verify if the images show an actual vehicle (not random objects, memes, or inappropriate content)
2. Identify the vehicle's brand, model, type (car/van/suv/truck/motorcycle/etc), and likely fuel type (petrol/diesel/electric/hybrid)
3. Compare your findings with the user-provided information
4. Rate the match accuracy for each field (0-100 score)
5. Assess image quality (clear, well-lit, multiple angles)
6. Identify any discrepancies or concerns

**Response Format (JSON):**
{{
    "is_vehicle_image": true/false,
    "detected_information": {{
        "brand": "detected brand name",
        "model": "detected model name or closest match",
        "vehicle_type": "car/van/suv/motorcycle/truck/etc",
        "fuel_type": "petrol/diesel/electric/hybrid/unknown",
        "year_range": "approximate year or range"
    }},
    "match_scores": {{
        "brand_match": 0-100,
        "model_match": 0-100,
        "vehicle_type_match": 0-100,
        "fuel_type_match": 0-100,
        "overall_confidence": 0-100
    }},
    "image_quality": {{
        "score": 0-100,
        "clear_images": true/false,
        "multiple_angles": true/false,
        "well_lit": true/false
    }},
    "verification_passed": true/false,
    "discrepancies": ["list any discrepancies found"],
    "suggestions": "Suggestions to improve the listing or resolve discrepancies",
    "requires_manual_review": true/false,
    "confidence_level": "high/medium/low"
}}

Provide ONLY valid JSON response, no additional text."""
        
        return prompt
    
    def call_openai_vision_api(self, prompt: str, image_urls: List[str]) -> Dict:
        """
        Make API call to OpenAI Vision API
        """
        try:
            # Prepare messages with images
            content = [{"type": "text", "text": prompt}]
            
            # Add images to content
            for image_url in image_urls:
                content.append({
                    "type": "image_url",
                    "image_url": {
                        "url": image_url,
                        "detail": "high"  # High detail for better analysis
                    }
                })
            
            # Make API call
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": content
                    }
                ],
                max_tokens=1500,
                temperature=0.2,  # Lower temperature for more consistent results
            )
            
            # Extract response
            ai_response = response.choices[0].message.content
            
            # Parse JSON response
            # Sometimes OpenAI wraps JSON in markdown code blocks
            if "```json" in ai_response:
                ai_response = ai_response.split("```json")[1].split("```")[0].strip()
            elif "```" in ai_response:
                ai_response = ai_response.split("```")[1].split("```")[0].strip()
            
            parsed_response = json.loads(ai_response)
            
            return {
                'success': True,
                'data': parsed_response,
                'raw_response': ai_response
            }
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {str(e)}\nResponse: {ai_response}")
            return {
                'success': False,
                'error': f"Failed to parse AI response: {str(e)}",
                'raw_response': ai_response if 'ai_response' in locals() else None
            }
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'raw_response': None
            }
    
    def calculate_overall_score(self, match_scores: Dict) -> float:
        """
        Calculate weighted overall verification score
        """
        weights = {
            'brand_match': 0.30,
            'model_match': 0.30,
            'vehicle_type_match': 0.25,
            'fuel_type_match': 0.15,
        }
        
        total_score = 0.0
        for field, weight in weights.items():
            score = match_scores.get(field, 0)
            total_score += score * weight
        
        return round(total_score, 2)
    
    def save_verification_result(
        self, 
        vehicle: Vehicle, 
        ai_response: Dict, 
        raw_response: str,
        images_count: int
    ) -> VehicleVerificationResult:
        """
        Save verification results to database
        """
        detected_info = ai_response.get('detected_information', {})
        match_scores = ai_response.get('match_scores', {})
        image_quality = ai_response.get('image_quality', {})
        
        # Calculate overall score
        overall_score = self.calculate_overall_score(match_scores)
        
        # Determine if verification passed
        verification_passed = ai_response.get('verification_passed', False)
        requires_manual_review = ai_response.get('requires_manual_review', False)
        
        # Auto-determine manual review based on score
        if overall_score < self.MANUAL_REVIEW_THRESHOLD:
            requires_manual_review = True
        
        # Create verification result
        verification_result = VehicleVerificationResult.objects.create(
            vehicle=vehicle,
            # AI detected information
            ai_detected_brand=detected_info.get('brand'),
            ai_detected_model=detected_info.get('model'),
            ai_detected_vehicle_type=detected_info.get('vehicle_type'),
            ai_detected_fuel_type=detected_info.get('fuel_type'),
            ai_detected_year=detected_info.get('year_range'),
            # Match scores
            brand_match_score=match_scores.get('brand_match'),
            model_match_score=match_scores.get('model_match'),
            vehicle_type_match_score=match_scores.get('vehicle_type_match'),
            fuel_type_match_score=match_scores.get('fuel_type_match'),
            image_quality_score=image_quality.get('score'),
            overall_confidence_score=overall_score,
            # Image validation
            is_vehicle_image=ai_response.get('is_vehicle_image', False),
            images_analyzed_count=images_count,
            # Metadata
            ai_raw_response=raw_response,
            ai_suggestions=ai_response.get('suggestions'),
            discrepancies=ai_response.get('discrepancies', []),
            # Status
            verification_passed=verification_passed and overall_score >= self.PASS_THRESHOLD,
            requires_manual_review=requires_manual_review,
        )
        
        # Update vehicle verification status
        if verification_passed and overall_score >= self.PASS_THRESHOLD:
            vehicle.verification_status = 'verified'
            vehicle.is_verified = True
        elif requires_manual_review or overall_score < self.MANUAL_REVIEW_THRESHOLD:
            vehicle.verification_status = 'manual_review'
            vehicle.is_verified = False
        else:
            vehicle.verification_status = 'failed'
            vehicle.is_verified = False
        
        vehicle.verification_score = overall_score
        vehicle.verification_attempts += 1
        vehicle.last_verification_at = datetime.now()
        vehicle.save()
        
        return verification_result
    
    def verify_vehicle(self, vehicle_id: int) -> Tuple[bool, Dict]:
        """
        Main method to verify a vehicle listing
        
        Returns:
            Tuple[bool, Dict]: (success, result_data)
        """
        try:
            # Get vehicle
            vehicle = Vehicle.objects.get(id=vehicle_id)
            
            # Check if vehicle has images
            if not vehicle.images.exists():
                return False, {
                    'error': 'No images found for verification',
                    'status': 'failed'
                }
            
            # Update status to in_progress
            vehicle.verification_status = 'in_progress'
            vehicle.save()
            
            # Prepare images
            image_urls = self.prepare_image_urls(vehicle)
            
            if not image_urls:
                vehicle.verification_status = 'failed'
                vehicle.save()
                return False, {
                    'error': 'Could not process vehicle images',
                    'status': 'failed'
                }
            
            # Build prompt
            prompt = self.build_verification_prompt(vehicle)
            
            # Call OpenAI API
            api_response = self.call_openai_vision_api(prompt, image_urls)
            
            if not api_response['success']:
                vehicle.verification_status = 'failed'
                vehicle.save()
                
                # Save error result
                VehicleVerificationResult.objects.create(
                    vehicle=vehicle,
                    error_message=api_response['error'],
                    verification_passed=False,
                    images_analyzed_count=len(image_urls)
                )
                
                return False, {
                    'error': api_response['error'],
                    'status': 'failed'
                }
            
            # Save verification result
            verification_result = self.save_verification_result(
                vehicle=vehicle,
                ai_response=api_response['data'],
                raw_response=api_response['raw_response'],
                images_count=len(image_urls)
            )
            
            return True, {
                'status': vehicle.verification_status,
                'verification_result': verification_result,
                'message': 'Verification completed successfully'
            }
            
        except Vehicle.DoesNotExist:
            return False, {
                'error': 'Vehicle not found',
                'status': 'failed'
            }
        except Exception as e:
            logger.error(f"Verification error for vehicle {vehicle_id}: {str(e)}")
            return False, {
                'error': str(e),
                'status': 'failed'
            }
    
    def get_verification_status(self, vehicle_id: int) -> Dict:
        """
        Get current verification status and latest results
        """
        try:
            vehicle = Vehicle.objects.get(id=vehicle_id)
            latest_result = vehicle.verification_results.first()
            
            data = {
                'vehicle_id': vehicle.id,
                'verification_status': vehicle.verification_status,
                'is_verified': vehicle.is_verified,
                'verification_score': vehicle.verification_score,
                'attempts': vehicle.verification_attempts,
                'last_verification': vehicle.last_verification_at,
            }
            
            if latest_result:
                data['latest_result'] = {
                    'id': latest_result.id,
                    'detected_brand': latest_result.ai_detected_brand,
                    'detected_model': latest_result.ai_detected_model,
                    'detected_type': latest_result.ai_detected_vehicle_type,
                    'detected_fuel_type': latest_result.ai_detected_fuel_type,
                    'confidence_score': latest_result.overall_confidence_score,
                    'passed': latest_result.verification_passed,
                    'requires_manual_review': latest_result.requires_manual_review,
                    'discrepancies': latest_result.discrepancies,
                    'suggestions': latest_result.ai_suggestions,
                    'created_at': latest_result.created_at,
                }
            
            return {'success': True, 'data': data}
            
        except Vehicle.DoesNotExist:
            return {'success': False, 'error': 'Vehicle not found'}
        except Exception as e:
            logger.error(f"Error getting verification status: {str(e)}")
            return {'success': False, 'error': str(e)}

