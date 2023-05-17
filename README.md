# Simple Websocket demo

~~~ bash
prefix=cptdjswebsockets
node server.js
# Start with green background
node server.js localhost 8000 009900 blue
curl -v http://localhost:8000/index.html
curl -v -H"Cookie: mycookie=test" http://localhost:8000/index.html 
curl -v -H"Cookie: mycookie1=test;mycookie2=test" http://localhost:8000/index.html 
curl -v http://localhost:8000/green # 500 Internal Server Error
curl -v http://localhost:8000/blue # 200 ok
curl "http://localhost:8000/health?hrc=500"

pm2 start server.js
~~~

## Misc
### github
~~~ bash
gh repo create $prefix --public
git init
git remote remove origin
git remote add origin https://github.com/cpinotossi/$prefix.git
git status
git add .gitignore
git add *
git commit -m"add cookie support"
git push origin main
git push --recurse-submodules=on-demand
git rm README.md # unstage
git --help
git config advice.addIgnoredFile false
git pull origin main
git merge 
origin main
git config pull.rebase false
~~~


