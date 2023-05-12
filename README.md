# Movie Blog

### What is it?

This is a personal project for me to view and organize the movies I watch and blog about.  I love to collect movies and watch them and write a short little blog post about it as a personal movie-watching journal.  However, nothing available lets me track the movies the way I want to.  Features in this application include:

1. Filtering (by custom tags, decades/years, actors/directors, and more)
2. Statistics aggregation for ratings, runtimes and even words-per-post
3. Visualization of watch trends over time or over movie release year
4. Custom layout for specialized movie watchlist types

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
