# Movie Blog

### Deployment & Branches

To deploy from a branch:

- Commit and push changes to remote branch
- `git push heroku <branchName>:main`

To merge changes from branch:

- Commit and push changes to remote branch
- Check out `main`
- `git merge <branchName>`
- Check out `master`
- `git merge main`
- (Optional deploy to Heroku) `git push`
