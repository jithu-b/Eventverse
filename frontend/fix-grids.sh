#!/bin/bash
set -e

# 1. ReportsPage.tsx — report cards grid
sed -i '' \
  's/grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0/grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-2 sm:px-0/' \
  src/pages/ReportsPage.tsx

# 2. HomePage.tsx — Event Cards Grid (line 283 only; hero/features grids at 68/305/360 untouched)
sed -i '' \
  's/grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8/grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8/' \
  src/pages/HomePage.tsx

# 3. EventDiscoveryPage.tsx — only the 'grid' branch of layoutMode; list-view branch left alone
sed -i '' \
  "s/layoutMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8': 'space-y-4'/layoutMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8' : 'space-y-4'/" \
  src/pages/EventDiscoveryPage.tsx

echo "Done. Verifying:"
grep -n "grid-cols" src/pages/ReportsPage.tsx
grep -n "grid-cols" src/pages/HomePage.tsx
grep -n "grid-cols" src/pages/EventDiscoveryPage.tsx
