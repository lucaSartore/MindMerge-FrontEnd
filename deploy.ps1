npm run build

mv 404.html dist/404.html

cd dist

git init
git add -A
git commit -m 'deploy'



git push -f  https://github.com/lucaSartore/MindMergeApp master:master