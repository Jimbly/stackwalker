@for /F usebackq %%a in (`git rev-parse HEAD`) do SET VER=%%a
node build build
xcopy /e /y dist\build.dev\client\ ..\stackwalker-gh-pages\
pushd ..\stackwalker-gh-pages\
git add .
git commit -m "Publish latest version from master@%VER%"
git push
