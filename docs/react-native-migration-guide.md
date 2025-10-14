# React Native Migration Guide for GoldRock Health

## Overview

This guide outlines the technical process for migrating the GoldRock Health web application to React Native using Expo.

**Why React Native + Expo?**
- ✅ 90% code reuse from existing React web app
- ✅ Shared TypeScript types and business logic
- ✅ Same API endpoints and backend
- ✅ Faster development (4-6 weeks vs 12-16 weeks native)
- ✅ Lower cost ($30K vs $80K+ for native iOS/Android)
- ✅ Future Android support included

---

## Architecture Comparison

### Current Web Stack
```
Frontend: React 18 + TypeScript + Vite
UI: Tailwind CSS + shadcn/ui
State: TanStack Query + React Context
Backend: Express.js + PostgreSQL
Auth: Replit Auth (OAuth)
Payments: Stripe
```

### Mobile Stack (React Native + Expo)
```
Frontend: React Native + TypeScript + Expo
UI: React Native Paper (or NativeWind for Tailwind)
State: TanStack Query + React Context (same!)
Backend: Express.js + PostgreSQL (no changes!)
Auth: Replit Auth (same!)
Payments: Stripe Mobile SDK
```

**Key Insight:** Backend and most frontend logic stays identical.

---

## Component Migration Strategy

### 1. Direct Migration (No Changes)

These components work as-is in React Native:

```typescript
// ✅ Business logic hooks - work perfectly
export function useAuth() {
  const { data: user } = useQuery({ queryKey: ['/api/auth/user'] });
  return { user, isAuthenticated: !!user };
}

// ✅ API clients - identical
export async function analyzeBill(billId: string) {
  return apiRequest(`/api/bills/${billId}/analyze`, { method: 'POST' });
}

// ✅ Utilities and helpers - same
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
```

**Migration effort:** Copy & paste ✅

### 2. Simple Conversion (Web → Native)

Replace HTML elements with React Native equivalents:

**Web (HTML/Tailwind):**
```tsx
<div className="bg-white p-4 rounded-lg shadow">
  <h1 className="text-2xl font-bold">Medical Bills</h1>
  <p className="text-gray-600">Manage your bills</p>
  <button className="bg-blue-600 text-white px-4 py-2 rounded">
    Upload Bill
  </button>
</div>
```

**Mobile (React Native):**
```tsx
<View style={styles.container}>
  <Text style={styles.title}>Medical Bills</Text>
  <Text style={styles.subtitle}>Manage your bills</Text>
  <TouchableOpacity style={styles.button}>
    <Text style={styles.buttonText}>Upload Bill</Text>
  </TouchableOpacity>
</View>
```

**Or with NativeWind (Tailwind for React Native):**
```tsx
<View className="bg-white p-4 rounded-lg shadow-md">
  <Text className="text-2xl font-bold">Medical Bills</Text>
  <Text className="text-gray-600">Manage your bills</Text>
  <Pressable className="bg-blue-600 px-4 py-2 rounded">
    <Text className="text-white">Upload Bill</Text>
  </Pressable>
</View>
```

**Migration effort:** Find & replace with automated tools 🔄

### 3. Platform-Specific Features

Add mobile-native capabilities:

```typescript
import { Platform, Linking } from 'react-native';
import * as Camera from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

// Camera capture (iOS only in web)
export async function captureBillPhoto() {
  const { status } = await Camera.requestCameraPermissionsAsync();
  
  if (status !== 'granted') {
    Alert.alert('Permission needed', 'Camera access required to scan bills');
    return null;
  }
  
  // Open camera UI
  const photo = await Camera.takePictureAsync();
  return photo.uri;
}

// Phone number click-to-call
export function callProvider(phoneNumber: string) {
  if (Platform.OS === 'ios') {
    Linking.openURL(`tel:${phoneNumber}`);
  }
}
```

**Migration effort:** New code, platform-specific features ⚡

---

## File Structure

### Shared Code (90% reusable)

```
shared/
├── hooks/
│   ├── useAuth.ts          ✅ Works in both web and mobile
│   ├── useBills.ts         ✅ Works in both
│   └── useStripe.ts        🔄 Minor tweaks for mobile SDK
├── lib/
│   ├── api-client.ts       ✅ Identical
│   ├── formatters.ts       ✅ Identical
│   └── validators.ts       ✅ Identical
├── types/
│   └── schema.ts           ✅ Shared TypeScript types
└── constants/
    └── config.ts           ✅ Same config
```

### Platform-Specific Code (10% unique)

```
mobile/                     # React Native app
├── app/                    # Expo Router (file-based routing)
│   ├── (tabs)/
│   │   ├── index.tsx      # Home/Dashboard
│   │   ├── bills.tsx      # Bill list
│   │   ├── upload.tsx     # Camera upload
│   │   └── settings.tsx   # Settings
│   ├── bill/[id].tsx      # Bill detail (dynamic route)
│   └── _layout.tsx        # Root layout
├── components/
│   ├── BillCard.tsx       # Native version of web component
│   ├── CameraView.tsx     # iOS camera interface
│   └── PushNotification.tsx # Mobile-only
└── app.json               # Expo config

web/                        # Existing web app
├── src/
│   ├── pages/             # Wouter routing
│   ├── components/        # Web components
│   └── App.tsx
└── index.html
```

---

## Step-by-Step Migration Process

### Step 1: Setup Expo Project (Day 1)

```bash
# Install Expo CLI
npm install -g expo-cli

# Create new Expo project
npx create-expo-app goldrock-mobile --template tabs

# Install dependencies
cd goldrock-mobile
npm install react-native-paper
npm install @tanstack/react-query
npm install axios
npm install @stripe/stripe-react-native

# Install Expo modules
npx expo install expo-camera expo-image-picker
npx expo install expo-notifications expo-local-authentication
npx expo install expo-secure-store expo-linking
```

### Step 2: Copy Shared Code (Day 2)

```bash
# Create shared folder
mkdir shared

# Copy business logic from web app
cp -r ../web/src/hooks shared/
cp -r ../web/src/lib shared/
cp -r ../web/shared/schema.ts shared/types/

# Verify imports work
npm run typecheck
```

### Step 3: Create Mobile UI Components (Day 3-5)

Convert web components to React Native:

**Web Component (Input):**
```tsx
// web/src/components/ui/input.tsx
export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn("border rounded px-3 py-2", className)}
      {...props}
    />
  );
}
```

**Mobile Component (Input):**
```tsx
// mobile/components/ui/Input.tsx
import { TextInput, StyleSheet } from 'react-native';

export function Input({ style, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
```

### Step 4: Implement Navigation (Day 6-7)

Use Expo Router (file-based routing like Next.js):

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Home, FileText, Upload, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tabs.Screen
        name="bills"
        options={{
          title: 'Bills',
          tabBarIcon: ({ color }) => <FileText color={color} />,
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color }) => <Upload color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings color={color} />,
        }}
      />
    </Tabs>
  );
}
```

### Step 5: Add iOS-Specific Features (Day 8-10)

#### Camera Integration
```tsx
// components/CameraView.tsx
import { Camera } from 'expo-camera';
import { useState } from 'react';

export function BillCamera({ onCapture }: Props) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      onCapture(photo.uri);
    }
  };
  
  return (
    <Camera style={styles.camera} ref={cameraRef}>
      <TouchableOpacity onPress={takePicture}>
        <Text>Capture</Text>
      </TouchableOpacity>
    </Camera>
  );
}
```

#### Push Notifications
```tsx
// lib/notifications.ts
import * as Notifications from 'expo-notifications';

export async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  
  if (status === 'granted') {
    const token = await Notifications.getExpoPushTokenAsync();
    // Send token to backend
    await apiRequest('/api/push-token', {
      method: 'POST',
      body: { token: token.data },
    });
  }
}

export function scheduleBillAnalysisNotification(billId: string) {
  Notifications.scheduleNotificationAsync({
    content: {
      title: 'Bill Analysis Complete! 💰',
      body: 'We found potential savings on your medical bill',
      data: { billId },
    },
    trigger: { seconds: 5 },
  });
}
```

### Step 6: Test on iOS Simulator (Day 11-12)

```bash
# Start Expo dev server
npx expo start

# Press 'i' to open iOS Simulator
# Or scan QR code with Expo Go app on physical device

# Test all features:
# - Authentication flow
# - Bill upload (camera + photos)
# - AI analysis
# - Push notifications
# - Biometric auth
# - Account deletion
```

### Step 7: Build for TestFlight (Day 13-14)

```bash
# Configure EAS Build
npm install -g eas-cli
eas login
eas build:configure

# Create iOS build
eas build --platform ios --profile preview

# Submit to TestFlight
eas submit --platform ios
```

---

## Component Conversion Reference

### Common Conversions

| Web (HTML/Tailwind) | React Native | Notes |
|---------------------|--------------|-------|
| `<div>` | `<View>` | Container |
| `<span>`, `<p>`, `<h1>` | `<Text>` | All text |
| `<button>` | `<TouchableOpacity>` or `<Pressable>` | Buttons |
| `<input>` | `<TextInput>` | Text input |
| `<img>` | `<Image>` | Images |
| `<a>` | `<TouchableOpacity>` + `Linking` | Links |
| `className` | `style` | Styling |
| `onClick` | `onPress` | Touch events |

### Styling Approaches

**Option 1: StyleSheet (React Native standard)**
```tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
});

<View style={styles.container}>...</View>
```

**Option 2: NativeWind (Tailwind for RN)**
```tsx
import { styled } from 'nativewind';

const StyledView = styled(View);

<StyledView className="bg-white p-4 rounded-lg">...</StyledView>
```

**Recommendation:** Use NativeWind for faster migration (90% Tailwind compatibility)

---

## API Integration

### No Backend Changes Required! ✅

The mobile app uses the same API endpoints:

```typescript
// shared/lib/api-client.ts (works in web AND mobile)
import axios from 'axios';

const API_URL = Platform.OS === 'web' 
  ? 'https://goldrockhealth.com/api'
  : 'https://goldrockhealth.com/api'; // Same!

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Same hooks work everywhere
export function useBills() {
  return useQuery({
    queryKey: ['/api/bills'],
    queryFn: () => apiClient.get('/api/bills').then(r => r.data),
  });
}
```

### Authentication

Continue using Replit Auth (OAuth works in mobile):

```typescript
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

export async function loginWithReplit() {
  const redirectUrl = Linking.createURL('auth');
  const authUrl = `https://replit.com/auth?redirect_uri=${redirectUrl}`;
  
  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
  
  if (result.type === 'success') {
    // Extract token from redirect
    const token = new URL(result.url).searchParams.get('token');
    await SecureStore.setItemAsync('auth_token', token);
  }
}
```

---

## Testing Strategy

### 1. Unit Tests (Shared Code)

```typescript
// shared/hooks/__tests__/useBills.test.ts
import { renderHook } from '@testing-library/react-hooks';
import { useBills } from '../useBills';

test('fetches bills correctly', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useBills());
  
  await waitForNextUpdate();
  
  expect(result.current.data).toHaveLength(5);
});
```

**Same tests work for web AND mobile!**

### 2. Component Tests (Mobile)

```typescript
// mobile/components/__tests__/BillCard.test.tsx
import { render } from '@testing-library/react-native';
import { BillCard } from '../BillCard';

test('renders bill information', () => {
  const { getByText } = render(
    <BillCard 
      billName="ER Visit"
      amount={12450}
      provider="Metro Hospital"
    />
  );
  
  expect(getByText('ER Visit')).toBeTruthy();
  expect(getByText('$12,450.00')).toBeTruthy();
});
```

### 3. E2E Tests (Detox)

```typescript
// e2e/billUpload.test.ts
describe('Bill Upload Flow', () => {
  it('should upload bill via camera', async () => {
    await element(by.id('upload-tab')).tap();
    await element(by.id('camera-button')).tap();
    await element(by.id('capture-button')).tap();
    await expect(element(by.text('Bill uploaded!'))).toBeVisible();
  });
});
```

---

## Performance Optimization

### 1. Image Optimization

```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: billImageUrl }}
  placeholder={blurhash} // Show blur while loading
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk" // Aggressive caching
/>
```

### 2. List Virtualization

```typescript
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={bills}
  renderItem={({ item }) => <BillCard bill={item} />}
  estimatedItemSize={100}
  // 10x faster than FlatList!
/>
```

### 3. Code Splitting

```typescript
// Lazy load heavy screens
const BillAnalysis = lazy(() => import('./screens/BillAnalysis'));
const DisputeLetters = lazy(() => import('./screens/DisputeLetters'));
```

---

## Deployment

### TestFlight (Beta Testing)

```bash
# Build for TestFlight
eas build --platform ios --profile preview

# Submit to App Store Connect
eas submit --platform ios --latest

# Add testers in App Store Connect
# They'll receive email invite to TestFlight
```

### Production Release

```bash
# Build production version
eas build --platform ios --profile production

# Submit for App Review
eas submit --platform ios --latest

# Monitor review status
eas build:list
```

---

## Cost Analysis

### Development Costs

| Approach | Time | Cost | Pros | Cons |
|----------|------|------|------|------|
| **React Native + Expo** | 4-6 weeks | $24K-35K | Fast, 90% code reuse, future Android | Learning curve for team |
| **Native Swift** | 12-16 weeks | $60K-80K | Best performance, iOS-optimized | iOS only, no code reuse |
| **Flutter** | 8-12 weeks | $40K-60K | Good performance, cross-platform | Dart language, no web reuse |

**Recommendation:** React Native + Expo (best ROI)

### Ongoing Costs

- Apple Developer Program: $99/year
- EAS Build (Expo): $29/month or $0 (free tier)
- Push Notifications: Free (Expo)
- CodePush (OTA updates): Free
- App Store fees: 30% on subscriptions (first year), 15% after

---

## Timeline Summary

| Week | Focus | Deliverables |
|------|-------|--------------|
| **1** | Setup + Legal | ✅ Expo project, Privacy Policy, Terms, Disclaimer |
| **2** | Core Features | ✅ Account deletion, Settings, App Store docs |
| **3** | iOS Features | Camera, Photos, Push Notifications |
| **4** | Polish + Beta | Biometric auth, Offline mode, TestFlight |
| **5** | iOS Exclusive | Widgets, Siri Shortcuts, Share Sheet |
| **6** | Submission | Final testing, App Review prep, Submit |
| **7-8** | Launch | App Review, Beta feedback, Public release |

---

## Success Checklist

### Pre-Launch ✅
- [x] Expo project configured with app.json
- [x] Privacy Policy with iOS sections
- [x] Terms of Service with mobile terms
- [x] Medical disclaimer on launch
- [x] Account deletion feature
- [x] App Store metadata prepared
- [x] Demo account created

### Launch Ready 🚀
- [ ] Camera and photo library working
- [ ] Push notifications configured
- [ ] Biometric authentication optional
- [ ] Offline mode with sync
- [ ] TestFlight beta complete
- [ ] App Store assets uploaded
- [ ] Submitted for App Review

---

## Resources

### Documentation
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [Expo Router](https://expo.github.io/router/docs/)
- [NativeWind](https://www.nativewind.dev/)

### Community
- [React Native Discord](https://discord.gg/reactnative)
- [Expo Discord](https://chat.expo.dev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

### Tools
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/) - Advanced debugging
- [Reactotron](https://github.com/infinitered/reactotron) - Inspector

---

**Next Step:** Begin Phase 3 - iOS-Specific Features (Camera, Notifications, Biometrics)

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Owner:** GoldRock Health Engineering Team
