import re

path = "src/pages/ReportsPage.tsx"
with open(path) as f:
    content = f.read()

replacements = [
    (
        '<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">',
        '<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-10 text-center px-2">',
    ),
    (
        '<h1 className="text-4xl sm:text-5xl font-bold text-[#18131A] mb-4">Event Reports</h1>',
        '<h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#18131A] mb-2 sm:mb-4">Event Reports</h1>',
    ),
    (
        '<p className="text-lg text-[#6B6470] max-w-2xl mx-auto">Flip through detailed reports from our events</p>',
        '<p className="text-sm sm:text-lg text-[#6B6470] max-w-2xl mx-auto">Flip through detailed reports from our events</p>',
    ),
    (
        '''          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#EC4899] to-[#A855F7] text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            <Upload className="w-4 h-4" /> Upload Report
          </button>''',
        '''          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base bg-gradient-to-r from-[#EC4899] to-[#A855F7] text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            <Upload className="w-4 h-4" /> Upload Report
          </button>''',
    ),
    (
        '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">',
        '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">',
    ),
    (
        'className="relative h-48 bg-gradient-to-br from-[#EC4899] to-[#A855F7] overflow-hidden cursor-pointer"',
        'className="relative h-36 sm:h-48 bg-gradient-to-br from-[#EC4899] to-[#A855F7] overflow-hidden cursor-pointer"',
    ),
    (
        '<div className="p-6">',
        '<div className="p-4 sm:p-6">',
    ),
    (
        '<h3 className="text-xl font-bold text-[#18131A] mb-1 line-clamp-2">',
        '<h3 className="text-base sm:text-xl font-bold text-[#18131A] mb-1 line-clamp-2">',
    ),
]

missing = []
for old, new in replacements:
    if old not in content:
        missing.append(old[:70])
    else:
        content = content.replace(old, new, 1)

with open(path, "w") as f:
    f.write(content)

if missing:
    print("NOT FOUND (skipped):")
    for m in missing:
        print(" -", m)
else:
    print("All replacements applied successfully.")
