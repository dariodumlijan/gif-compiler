# Gif Compiler

### Compile C++ code
- The commands for portable build were found but portable magick requires too many dependencies
  - Maybe it is possible to find a portable build online or use cmake to create the build

```sh
# Intel - x86_64
c++ -o ./scripts/generate ./scripts/generate.cpp \
`/usr/local/opt/imagemagick@6/bin/Magick++-config --cppflags --cxxflags --ldflags --libs` \
-std=c++17 -arch x86_64
```

```sh
# Intel - x86_64 - static
c++ -o ./scripts/generate ./scripts/generate.cpp \
`/usr/local/opt/imagemagick@6/bin/Magick++-config --cppflags --cxxflags --ldflags --libs` \
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
