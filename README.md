# Simple Websocket demo

~~~ bash
prefix=cptdjswebsockets
node server.js
# Start with green background
node server.js localhost 8000 009900
curl http://localhost:8000/index.html
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
git commit -m"merge into one port"
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