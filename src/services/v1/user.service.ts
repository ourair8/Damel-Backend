import { prisma} from "@/config/db.config";
import { CATEGORY } from "@prisma/client";

export const createPost = async function (
    id: string,
    text: string,
    tags: string, 
    image_link: string | undefined,
    category: CATEGORY
  ) {
    try {
      const createdPost = await prisma.posts.create({
        data: {
          user_id: id,
          text: text,
          tags: {
            set: JSON.parse(tags) 
          },
          category: category
        }
      });
  
      let createdImageLink = null;
      if (image_link) {
        createdImageLink = await prisma.image_link_post.create({
          data: {
            post_id: createdPost.id,
            image_link: image_link
          }
        });
      }
  
      return { ...createdPost, createdImageLink };
  
    } catch (err) {
      throw err;
    }
  };

export const getPost = async function(id: string) {
    try {
        const posts = await prisma.posts.findMany({
            where: {
                user_id: id,
            },
            include: {
                image_link_post: true,
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return posts.map(post => ({
            ...post,
        }));
    } catch (err) {
        throw err;
    }
}


export const feedByFollowing = async function(userId: string) {
    try {
        const feed = await prisma.posts.findMany({
            orderBy: {
                created_at: 'desc'
            },
            select: {
                id: true,
                text: true,
                created_at: true,
                updated_at: true,
                tags: true,
                user_id: true,
                users: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                    }
                },
                image_link_post: {
                    select: {
                        id: true,
                        image_link: true,
                    }
                }
            }
        });

        return feed.map(post => ({
            ...post,
        }));
    } catch (err) {
        throw err;
    }
}


export const feedByTags = async function(userId: string) {
    try {
        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: { tags: true }
        });

        if (!user || !user.tags.length) {
            return [];
        }

        const feed = await prisma.posts.findMany({
            where: {
                OR: user.tags.map(tag => ({
                    tags: {
                        has: tag
                    }
                }))
            },
            orderBy: {
                created_at: 'desc'
            },
            select: {
                id: true,
                text: true,
                created_at: true,
                updated_at: true,
                tags: true,
                user_id: true,
                users: {
                    select: {
                        id: true,
                        username: true,
                        name: true
                    }
                },
                image_link_post: {
                    select: {
                        id: true,
                        image_link: true
                    }
                }
            }
        });

        return feed.map(post => ({
            ...post,
        }));
    } catch (err) {
        throw err;
    }
}


export const getUserProfile = async function(userId: string) {
    try {
        const userProfile = await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                meta_profile_link: true,
                isVerified: true,
                country: true,
                isPublic: true,
                role: true,
                bio: true,
                tags: true,
                created_at: true,
                updated_at: true,
            }
        });

        console.log(userProfile)

        return {
            ...userProfile,
        };
    } catch (err) {
        throw err;
    }
}


export const editUserInfo = async function(userId: string, { username, name, bio, country }: { username?: string, name?: string, bio?: string, country?: string }) {
    try {
        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: {
                username,
                name,
                bio,
                country
            }
        });
        return updatedUser;
    } catch (err) {
        throw err;
    }
}

export const editUserTags = async function(userId: string, tags: string[]) {
    try {
        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: {
                tags
            }
        });
        return updatedUser;
    } catch (err) {
        throw err;
    }
}


// Activity

export const createReminder = async function(userId: string, title: string, content: string, deadline_time: Date) {
    try {
        const reminder = await prisma.reminders.create({
            data: {
                title,
                content,
                deadline_time,
                user_id: userId
            }
        });
        return reminder;
    } catch (err) {
        throw err;
    }
}

export const createDiary = async function(userId: string, title: string, content: string) {
    try {
        const diary = await prisma.diary.create({
            data: {
                title,
                content,
                user_id: userId
            }
        });
        return diary;
    } catch (err) {
        throw err;
    }
}



export const getReminders = async function(userId: string) {
    try {
        const reminders = await prisma.reminders.findMany({
            where: {
                user_id: userId
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        return reminders;
    } catch (err) {
        throw err;
    }
}


export const getDiary = async function(userId: string) {
    try {
        const diary = await prisma.diary.findMany({
            where: {
                user_id: userId
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        return diary;
    } catch (err) {
        throw err;
    }
}






