# Movie Blog Road Map Ideas

### Add/edit posts

Instead of relying on Wordpress for creating/hosting post content, I'd like to handle all of it directly in this system with no need for migration. A few considerations:

- Choose a CDN (instead of relying on image URLs hosted by Wordpress)
- Add image uploading capability
- Find a good HTML block editor
- Build in ability to edit content and apply/change tags

### Add in-app watchlist definition

Currently, I have to manually set up a watchlist through DynamoDB's interface directly. It'd be nice to have a watchlist creator tool. Things I'd need:

- Color picker
- Remarks handling (opening/closing)
- Type support. Anything for special types like brackets (March Madness)?

### Support multiple users/accounts

This app was tailored for my specific blog, but it would be a nice exercise to support users creating their own lists.

- DB structure probably needs to change to account for userIDs
- Add auth layer

### Add bracket handler

Right now, the bracket (March Madness) types are "structured" by convention. The blog posts have the matchups and winners in text after a regular post. I'm imagining something more structured where I can click a winner and leave a brief note and all of the bracket building is abstracted away

### More server-side processing

For a snappy UI, I load all the data client-side and do local sorting/filtering. For scalability, maybe some of that should be off-loaded to the server?
