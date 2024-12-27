# origin
This project was started when I worked at opentracker/leadboxer using flask and reactjs. 
But has since change flask to to based on fastapi full stack template https://github.com/fastapi/full-stack-fastapi-template
```
$ git remote set-url origin https://github.com/weetech-software/app-status.git
$ git remote add upstream https://github.com/fastapi/full-stack-fastapi-template.git
$ git branch -M main
$ git push -u origin main
```

# how to update from upstream template
```
$ git pull --no-commit upstream master
# check everything okay, if no conflict, merge
$ git merge --continue
# or
git fetch upstream
git checkout main
git merge upstream/master
```
