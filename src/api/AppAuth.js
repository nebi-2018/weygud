const { db_auth, db_store } = require("./Db");

const requestResult = (hasError, dataReceived) => {
  const status = { error: hasError, data: dataReceived };
  return status;
};
export const registerUser = async (userInfo) => {
  const requestStatus = { error: true, data: "" };
  console.log(userInfo);

  try {
    await db_auth
      .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
      .then(async (data) => {
        const user = data.user;
        await db_store
          .collection("users")
          .doc(user.uid)
          .set({
            avatar: "",
            userName: userInfo.name,
            expoToken: "null",
            userId: user.uid,
            company: userInfo.company,
            email: userInfo.email,
            phoneNumber: userInfo.phoneNumber
              ? userInfo.phoneNumber
              : "not given",
            type: "user",
          });
      });
    return requestResult(false, "user");
  } catch (error) {
    console.log("create user error", error);
    return requestResult(true, error.message);
  }
};

export const loginUser = async (email, password) => {
  const requestStatus = { error: true, data: "" };

  try {
    const result = await db_auth.signInWithEmailAndPassword(email, password);

    return requestResult(false, "user");
  } catch (error) {
    return requestResult(true, "Wrong email or password");
  }
};

export const forgerPassword = async (email) => {
  try {
    const mm = await db_auth.sendPasswordResetEmail(email);
    console.log(mm);
    return requestResult(false, "mee");
  } catch (e) {
    console.log("eee", e);
    return requestResult(true, "no account with this email address");
  }
};

export const deleteAccount = async (id) => {
  try {
    const userA = await db_auth.currentUser.delete();
    const user = await db_store.collection("users").doc(id).delete();

    return requestResult(false, "deleted");
  } catch (e) {
    console.log(e);
    return requestResult(
      true,
      "This operation is sensitive and requires recent authentication. Log in again before retrying this request"
    );
  }
};
