npm run build
cd dist

git init
git add -A
git commit -m 'deploy'

git push -f  https://github.com/lucaSartore/MindMergeApp master:master