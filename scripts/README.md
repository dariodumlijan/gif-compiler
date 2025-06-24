# How to create a portable build of the `./scripts/generate` C++ executable

The `generate` executable is compiled with C++ 17 and uses the following libraries:
- Magick++ 7.0.10
- libjpeg
- libpng
- libtiff
- libwebp
- libheif
- libbz2
- libz
- liblzma
- libopenjp2
- libraw
- libxml2
- libzip

For Magick++ lib to create a portable build the fallowing steps were done:
- Install x86_64 brew and all the required deps for magick
  ```sh
  arch -x86_64 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  arch -x86_64 /usr/local/bin/brew install jpeg-turbo libpng libtiff webp libheif bzip2 zlib xz openjpeg libraw libxml2 libzip
  ```
- Clone the Magick++ repository
  ```sh
  git clone https://github.com/ImageMagick/ImageMagick.git
  cd ImageMagick
  ```
- Set ENV variables:
  ```sh
  export LDFLAGS="-L/usr/local/lib -arch x86_64"
  export CPPFLAGS="-I/usr/local/include -arch x86_64"
  export PKG_CONFIG_PATH="/usr/local/lib/pkgconfig"
  ```
- Config magick portable build
  ```sh
  ./configure --prefix=$PATH_TO_GIF_COMPILER_ROOT_DIR/scripts/magick \
    --without-x \
    --without-fontconfig \
    --without-freetype \
    --without-lcms \
    --without-pango \
    --with-lqr \
    CFLAGS="-arch x86_64" CXXFLAGS="-arch x86_64" LDFLAGS="-arch x86_64 -L/usr/local/lib" CPPFLAGS="-I/usr/local/include"

  make
  make install
  ```

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

### Build for MacOS
```sh
# Universal
yarn build:mac
# M1
yarn build:mac --arm64
# Intel
yarn build:mac --x64
```
