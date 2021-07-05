module.exports = {
    Query: {

      getUser: () => null,

      getPosts: async (_, args, { Post }) => {
        const posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          });
        return posts;
      },

      infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
        let posts;
        if (pageNum === 1) {
          posts = await Post.find({})
            .sort({ createdDate: "desc" })
            .populate({
              path: "createdBy",
              model: "User"
            })
            .limit(pageSize);
        } else {
          // If page number is greater than one, figure out how many documents to skip
          const skips = pageSize * (pageNum - 1);
          posts = await Post.find({})
            .sort({ createdDate: "desc" })
            .populate({
              path: "createdBy",
              model: "User"
            })
            .skip(skips)
            .limit(pageSize);
        }
        const totalDocs = await Post.countDocuments();
        const hasMore = totalDocs > pageSize * pageNum;
        return { posts, hasMore };
      }

    },
    Mutation: {
      
      signupUser: async (_, { username, email, password }, { User }) => {
        const user = await User.findOne({ username });
        if (user) {
          throw new Error("User already exists");
        }
        const newUser = await new User({
          username,
          email,
          password
        }).save();
        return newUser;
      },
      
      addPost: async (
        _,
        { title, imageUrl, categories, description, creatorId },
        { Post }
      ) => {
        const newPost = await new Post({
          title,
          imageUrl,
          categories,
          description,
          createdBy: creatorId
        }).save();
        return newPost;
      }
    }
  };