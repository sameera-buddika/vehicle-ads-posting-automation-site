# 🧩 Reusable Components Guide

This guide explains how to use the reusable components in this project to write clean, maintainable code.

## 📋 Table of Contents

- [Form Components](#form-components)
- [Button Components](#button-components)
- [Alert Components](#alert-components)
- [Vehicle Components](#vehicle-components)
- [Layout Components](#layout-components)
- [Loading Components](#loading-components)
- [Constants & Utilities](#constants--utilities)

---

## 🔤 Form Components

Located in: `app/components/FormInput.js`

### FormInput

Standard text input with label and error handling.

```javascript
import { FormInput } from "@/app/components/FormInput";

<FormInput
  label="Manufacturer"
  name="manufacturer"
  type="text"
  placeholder="e.g., Toyota"
  value={formData.manufacturer}
  onChange={handleChange}
  required={true}
  error={errors.manufacturer}
/>
```

**Props:**
- `label` (string): Label text
- `name` (string): Input name
- `type` (string): Input type (default: "text")
- `placeholder` (string): Placeholder text
- `value` (string): Input value
- `onChange` (function): Change handler
- `required` (boolean): Is required field
- `error` (string): Error message to display

### FormSelect

Dropdown select with options.

```javascript
import { FormSelect } from "@/app/components/FormInput";
import { VEHICLE_TYPES } from "@/lib/constants";

<FormSelect
  label="Vehicle Type"
  name="vehicle_type"
  value={formData.vehicle_type}
  onChange={handleChange}
  options={VEHICLE_TYPES}
  placeholder="Select Type"
  required={true}
/>
```

**Props:**
- `label` (string): Label text
- `name` (string): Select name
- `value` (string): Selected value
- `onChange` (function): Change handler
- `options` (array): Array of `{ value, label }` objects
- `placeholder` (string): Default option text
- `required` (boolean): Is required field
- `error` (string): Error message

### FormTextarea

Multi-line text input.

```javascript
import { FormTextarea } from "@/app/components/FormInput";

<FormTextarea
  label="Description"
  name="description"
  placeholder="Enter description..."
  value={formData.description}
  onChange={handleChange}
  rows={4}
/>
```

### FormImageUpload

Image upload with preview.

```javascript
import { FormImageUpload } from "@/app/components/FormInput";

<FormImageUpload
  label="Vehicle Image"
  name="image"
  onChange={handleImageChange}
  currentImage={vehicle.image_url}
  preview={imagePreview}
  helpText="Max size: 5MB"
  required={false}
/>
```

---

## 🔘 Button Components

Located in: `app/components/Button.js`

### Button

Versatile button with multiple variants.

```javascript
import { Button } from "@/app/components/Button";

// Primary Button
<Button 
  variant="primary" 
  size="lg" 
  onClick={handleSubmit}
  loading={isSubmitting}
>
  Submit
</Button>

// Danger Button
<Button 
  variant="danger" 
  onClick={handleDelete}
>
  Delete
</Button>

// Full Width Button
<Button 
  variant="success" 
  fullWidth={true}
  type="submit"
>
  Save Changes
</Button>
```

**Variants:**
- `primary` - Purple background
- `secondary` - Gray background
- `success` - Green background
- `danger` - Red background
- `warning` - Yellow background
- `info` - Blue background
- `outline` - Outlined style

**Sizes:**
- `sm` - Small
- `md` - Medium (default)
- `lg` - Large
- `xl` - Extra large

**Props:**
- `variant` (string): Button style variant
- `size` (string): Button size
- `loading` (boolean): Show loading spinner
- `disabled` (boolean): Disable button
- `fullWidth` (boolean): Full width button
- `type` (string): Button type ("button", "submit", "reset")
- `onClick` (function): Click handler

---

## 🚨 Alert Components

Located in: `app/components/Alert.js`

### Alert

Notification message box.

```javascript
import { Alert } from "@/app/components/Alert";

// Error Alert
<Alert 
  type="error" 
  message="Failed to load data" 
  onClose={() => setError("")}
/>

// Success Alert
<Alert 
  type="success" 
  message="Vehicle posted successfully!" 
/>
```

**Types:**
- `success` - Green (✓)
- `error` - Red (✕)
- `warning` - Yellow (⚠)
- `info` - Blue (ℹ)

### EmptyState

Display when no data is available.

```javascript
import { EmptyState } from "@/app/components/Alert";

<EmptyState
  icon="📭"
  title="No Ads Yet"
  message="You haven't posted any vehicle ads yet."
  actionText="Post Your First Vehicle"
  onAction={() => router.push('/post')}
/>
```

---

## 🚗 Vehicle Components

Located in: `app/components/VehicleCard.js`

### VehicleCard

Card for displaying vehicle in grid.

```javascript
import { VehicleCard } from "@/app/components/VehicleCard";

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {vehicles.map((vehicle) => (
    <VehicleCard key={vehicle.id} vehicle={vehicle} />
  ))}
</div>
```

### VehicleListItem

List item for managing vehicles.

```javascript
import { VehicleListItem } from "@/app/components/VehicleCard";

<VehicleListItem
  vehicle={vehicle}
  onView={(id) => router.push(`/vehicles/${id}`)}
  onEdit={(id) => router.push(`/vehicles/${id}/edit`)}
  onDelete={(id) => handleDelete(id)}
/>
```

### Badge

Small colored label.

```javascript
import { Badge } from "@/app/components/VehicleCard";

<Badge color="purple">Car</Badge>
<Badge color="blue">Automatic</Badge>
<Badge color="green">Petrol</Badge>
```

---

## 📦 Layout Components

Located in: `app/components/PageContainer.js`

### PageContainer

Main page wrapper with Navbar.

```javascript
import { PageContainer } from "@/app/components/PageContainer";

<PageContainer>
  {/* Your content here */}
</PageContainer>
```

### PageHeader

Page title with optional actions.

```javascript
import { PageHeader } from "@/app/components/PageContainer";
import { Button } from "@/app/components/Button";

<PageHeader
  title="My Vehicle Ads"
  subtitle="Manage your listings"
  actions={
    <Button onClick={handlePost}>
      Post New Vehicle
    </Button>
  }
/>
```

### ContentContainer

Content wrapper with max-width.

```javascript
import { ContentContainer } from "@/app/components/PageContainer";

<ContentContainer maxWidth="lg">
  {/* Your content here */}
</ContentContainer>
```

**Max Width Options:**
- `container` - Responsive container (default)
- `sm` - 768px
- `md` - 1024px
- `lg` - 1280px
- `xl` - 1536px
- `full` - 100%

### Card

White card with shadow.

```javascript
import { Card } from "@/app/components/PageContainer";

<Card>
  <h2>Card Title</h2>
  <p>Card content...</p>
</Card>
```

---

## ⏳ Loading Components

Located in: `app/components/LoadingSpinner.js`

### LoadingSpinner

Animated spinner.

```javascript
import LoadingSpinner from "@/app/components/LoadingSpinner";

<LoadingSpinner 
  size="lg" 
  text="Loading..." 
  fullScreen={false}
/>
```

**Sizes:** `sm`, `md`, `lg`, `xl`

### SkeletonCard

Placeholder for loading cards.

```javascript
import { SkeletonCard } from "@/app/components/LoadingSpinner";

{loading && (
  <div className="grid grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
  </div>
)}
```

### SkeletonListItem

Placeholder for loading list items.

```javascript
import { SkeletonListItem } from "@/app/components/LoadingSpinner";

{loading && (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => <SkeletonListItem key={i} />)}
  </div>
)}
```

---

## 🛠️ Constants & Utilities

Located in: `lib/constants.js`

### Vehicle Type Options

```javascript
import { VEHICLE_TYPES } from "@/lib/constants";

<FormSelect
  options={VEHICLE_TYPES}
  // Returns: [{ value: "Car", label: "Car" }, ...]
/>
```

### Transmission Options

```javascript
import { TRANSMISSION_TYPES } from "@/lib/constants";
```

### Fuel Type Options

```javascript
import { FUEL_TYPES } from "@/lib/constants";
```

### Format Helpers

```javascript
import { formatPrice, formatDate } from "@/lib/constants";

const priceText = formatPrice(vehicle.price);
// Returns: "LKR 5,000,000"

const dateText = formatDate(vehicle.created_at);
// Returns: "January 15, 2025"
```

---

## 📝 Complete Example

Here's a complete example of a page using reusable components:

```javascript
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { vehicleAPI } from "@/lib/api";
import { PageContainer, PageHeader, ContentContainer, Card } from "@/app/components/PageContainer";
import { FormInput, FormSelect } from "@/app/components/FormInput";
import { Button } from "@/app/components/Button";
import { Alert, EmptyState } from "@/app/components/Alert";
import { VehicleCard } from "@/app/components/VehicleCard";
import { VEHICLE_TYPES } from "@/lib/constants";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleAPI.getVehicles();
      setVehicles(data);
    } catch (err) {
      setError("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <ContentContainer>
          <LoadingSpinner size="lg" text="Loading vehicles..." />
        </ContentContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentContainer>
        <PageHeader
          title="Browse Vehicles"
          subtitle="Find your perfect vehicle"
        />

        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError("")}
          />
        )}

        {vehicles.length === 0 ? (
          <EmptyState
            icon="🚗"
            title="No Vehicles Found"
            message="Check back later for new listings"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </ContentContainer>
    </PageContainer>
  );
}
```

---

## ✅ Benefits of Reusable Components

1. **Consistency**: UI looks uniform across the app
2. **Maintainability**: Update once, reflects everywhere
3. **Readability**: Cleaner, more semantic code
4. **Productivity**: Faster development
5. **Testing**: Easier to test individual components
6. **Accessibility**: Built-in accessibility features

---

## 🎯 Best Practices

1. **Always use reusable components** instead of repeating code
2. **Import from components** instead of copying styles
3. **Use constants** for dropdown options
4. **Leverage helpers** for formatting
5. **Follow naming conventions** used in examples
6. **Add proper prop validation** when extending components

---

**Happy coding with reusable components! 🚀**

