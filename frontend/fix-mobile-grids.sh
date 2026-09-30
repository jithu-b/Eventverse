#!/bin/bash
set -e

# 1. ReportsPage.tsx
sed -i '' \
  's/grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-2 sm:px-0/grid grid-cols-2 gap-4 sm:gap-6 px-2 sm:px-0/' \
  src/pages/ReportsPage.tsx

# 2. HomePage.tsx (line 283 only)
sed -i '' \
  's/grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8/grid grid-cols-2 gap-6 sm:gap-8/' \
  src/pages/HomePage.tsx

# 3. EventDiscoveryPage.tsx (grid branch only)
sed -i '' \
  "s/'grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8' : 'space-y-4'/'grid grid-cols-2 gap-6 sm:gap-8' : 'space-y-4'/" \
  src/pages/EventDiscoveryPage.tsx

echo "Done. Verifying:"
grep -n "grid-cols" src/pages/ReportsPage.tsx
grep -n "grid-cols" src/pages/HomePage.tsx
grep -n "grid-cols" src/pages/EventDiscoveryPage.tsx
