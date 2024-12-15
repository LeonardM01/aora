import {
  Client,
  Account,
  Avatars,
  Databases,
  Query,
  ID,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "solutions.leonard.aora",
  projectId: "66b507a200159c297546",
  databaseId: "aora-db-1",
  userCollectionId: "users",
  videoCollectionId: "videos",
  storageId: "files",
};

const client = new Client();
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export async function createUser(
  email: string,
  password: string,
  username: string,
) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    );
    if (!newAccount) {
      throw new Error("Account creation failed");
    }

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      },
    );

    return newUser;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
}

export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) {
      throw Error();
    }

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)],
    );

    if (!currentUser) throw Error();

    return currentUser.documents[0];
  } catch (error: any) {
    console.error(error);
  }
}

export async function getAllPosts() {
  try {
    return await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
    );
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getLatestPosts() {
  try {
    return await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)],
    );
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function searchPosts(query: string) {
  try {
    return await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)],
    );
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getUserPosts(userId: string) {
  try {
    return await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId)],
    );
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function signOut() {
  try {
    return await account.deleteSession("current");
  } catch (error: any) {
    throw new Error(error);
  }
}
