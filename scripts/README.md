# Compile C++ code

#### Intel - x86_64 compatible build
```sh
c++ -o ./scripts/generate ./scripts/generate.cpp \
`./scripts/magick/bin/Magick++-config --cppflags --cxxflags --ldflags --libs` \
-L/usr/local/lib -ljpeg -lpng -ltiff -lwebp -lheif -lbz2 -lz -llzma -lopenjp2 -lraw -lxml2 -lzip \
-std=c++17 -arch x86_64

dylibbundler -of -b -x ./scripts/generate -d ./scripts/lib/ -p @executable_path/lib/
```

### Check if generate executable has dynamic links
```sh
otool -L generate
```

### Build
```sh
# Universal
yarn electron:build

# M1
yarn electron:build --arm64

# Intel
yarn electron:build --x64
```

### After build process
1. Create ReadWrite copy of DMG
```sh
hdiutil convert -format UDRW -o "ReadWriteVersion.dmg" "ReadVersion.dmg"
```
2. Add `preinstall` script to `ReadWriteVersion.dmg`
3. Convert `ReadWriteVersion.dmg` back to `read-only``
```sh
hdiutil convert -format UDRO -o "ReadVersion.dmg" "ReadWriteVersion.dmg"
```
