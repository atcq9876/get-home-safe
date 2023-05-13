const app = require("../../server");
const request = require("supertest");
const User = require("../../models/userModel");
require("../mongodb_helper");

describe("/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("POST, when name, email and password are provided", () => {
    test("the response code is 200", async () => {
      let response = await request(app).post("/api/user/signup").send({
        name: "poppy",
        email: "poppy@email.com",
        phoneNumber: "07512345678",
        password: "passwordQ123!",
      });
      expect(response.statusCode).toBe(200);
    });

    test("a user is created", async () => {
      await request(app).post("/api/user/signup").send({
        name: "scarlett",
        email: "scarlett@email.com",
        phoneNumber: "07512345678",
        password: "passwordQ123!",
      });
      let users = await User.find();
      let newUser = users[users.length - 1];
      expect(newUser.email).toEqual("scarlett@email.com");
    });
  });

  describe("POST, when password is missing", () => {
    test("response code is 400", async () => {
      let response = await request(app)
        .post("/api/user/signup")
        .send({ name: "skye", email: "skye@email.com", phoneNumber: "07512345678" });
      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app)
        .post("/api/user/signup")
        .send({ name: "skye", email: "skye@email.com", phoneNumber: "07512345678" });
      let users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when email is missing", () => {
    test("response code is 400", async () => {
      let response = await request(app)
        .post("/api/user/signup")
        .send({ name: "skye", phoneNumber: "07512345678", password: "passwordQWERT123!" });
      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app)
        .post("/api/user/signup")
        .send({ name: "skye", phoneNumber: "07512345678", password: "passwordQWERT123!" });
      let users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when name is missing", () => {
    test("response code is 400", async () => {
      let response = await request(app)
        .post("/api/user/signup")
        .send({ email: "skye@skye.com", phoneNumber: "07512345678", password: "passwordQWERT123!" });
      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app)
        .post("/api/user/signup")
        .send({ email: "skye@skye.com", phoneNumber: "07512345678", password: "passwordQWERT123!" });
      let users = await User.find();
      expect(users.length).toEqual(0);
    });
  });
});

describe("POST, when phone number is missing", () => {
  test("response code is 400", async () => {
    let response = await request(app)
      .post("/api/user/signup")
      .send({ name: "skye", email: "skye@skye.com", password: "passwordQWERT123!" });
    expect(response.statusCode).toBe(400);
  });

  test("does not create a user", async () => {
    await request(app)
      .post("/api/user/signup")
      .send({ name: "skye", email: "skye@skye.com", password: "passwordQWERT123!" });
    let users = await User.find();
    expect(users.length).toEqual(0);
  });
});

describe("/users/login", () => {
  beforeEach(async () => {
    let response = await request(app).post("/api/user/signup").send({
      name: "poppy",
      email: "poppy@email.com",
      phoneNumber: "07771777888",
      password: "passwordQ123!",
    });
  });
  afterEach(async () => {
    await User.deleteMany({});
  });
  test("response code is 400 when email is wrong", async () => {
    let response = await request(app)
      .post("/api/user/login")
      .send({ email: "jadgcjac@shjbfk.com", password: "passwordQ123!" });
    expect(response.statusCode).toBe(400);
  });
  test("response code is 400 when password is wrong", async () => {
    let response = await request(app)
      .post("/api/user/login")
      .send({ email: "poppy@email.com", password: "sdjghcajshc" });
    expect(response.statusCode).toBe(400);
  });
  test("response code is 200 when both correct", async () => {
    let response = await request(app)
      .post("/api/user/login")
      .send({ email: "poppy@email.com", password: "passwordQ123!" });
    expect(response.statusCode).toBe(200);
  });
})

describe("emergencyContact", () => {
  beforeEach(async () => {
    let response1 = await request(app).post("/api/user/signup").send({
      name: "poppy",
      email: "poppy@email.com",
      phoneNumber: "07771777888",
      password: "passwordQ123!",
    });
    let response2 = await request(app).post("/api/user/signup").send({
      name: "jim",
      email: "jim@email.com",
      phoneNumber: "07771777999",
      password: "passwordQ123!",
    });
  });
  afterEach(async () => {
    await User.deleteMany({});
  });
  test("status code is 200 if the user exists", async () => {
    const poppy = await User.findOne({name: "poppy"})
    const poppy_id = poppy._id
    let response = await request(app)
      .patch("/api/user/contact/")
      .send({ user_id: poppy_id, emergencyContactEmail: "jim@email.com", field: "add" });
    expect(response.statusCode).toBe(200);
  });
  test("status code is 400 you try to add yourself", async () => {
    const poppy = await User.findOne({name: "poppy"})
    const poppy_id = poppy._id
    let response = await request(app)
      .patch("/api/user/contact/")
      .send({ user_id: poppy_id, emergencyContactEmail: "poppy@email.com", field: "add" });
    expect(response.statusCode).toBe(400);
  });
  test("it stores contact information", async () => {
    const poppy = await User.findOne({name: "poppy"})
    const poppy_id = poppy._id
    let response = await request(app)
      .patch("/api/user/contact/")
      .send({ user_id: poppy_id, emergencyContactEmail: "jim@email.com", field: "add" });
    const newPoppy = await User.findOne({name: "poppy"})
    expect(newPoppy.emergencyContacts.length).toBe(1);
  });
  test("it cannot add duplicate contacts", async () => {
    const poppy = await User.findOne({name: "poppy"})
    const poppy_id = poppy._id
    let response = await request(app)
      .patch("/api/user/contact/")
      .send({ user_id: poppy_id, emergencyContactEmail: "jim@email.com", field: "add" });
    let response2 = await request(app)
      .patch("/api/user/contact/")
      .send({ user_id: poppy_id, emergencyContactEmail: "jim@email.com", field: "add" })
    expect(response2.statusCode).toBe(400);
  })
  test("it does not duplicate contact information in contact list", async () => {
    const poppy = await User.findOne({name: "poppy"})
    const poppy_id = poppy._id
    let response = await request(app)
      .patch("/api/user/contact/")
      .send({ user_id: poppy_id, emergencyContactEmail: "jim@email.com", field: "add" });
    let response2 = await request(app)
      .patch("/api/user/contact/")
      .send({ user_id: poppy_id, emergencyContactEmail: "jim@email.com", field: "add" })
      const newPoppy = await User.findOne({name: "poppy"})
      expect(newPoppy.emergencyContacts.length).toBe(1);
  })
  test("it deletes contacts", async () => {
    const poppy = await User.findOne({name: "poppy"})
    const poppy_id = poppy._id
    let response = await request(app)
      .patch("/api/user/contact/")
      .send({ user_id: poppy_id, emergencyContactEmail: "jim@email.com", field: "add" });
    let response2 = await request(app)
      .patch("/api/user/contact/")
      .send({ user_id: poppy_id, emergencyContactEmail: "jim@email.com", field: "delete" })
      expect(response2.statusCode).toBe(200);
  })
  test("it removes contacts from contact list", async () => {
    const poppy = await User.findOne({name: "poppy"})
    const poppy_id = poppy._id
    let response = await request(app)
      .patch("/api/user/contact/")
      .send({ user_id: poppy_id, emergencyContactEmail: "jim@email.com", field: "add" });
    let response2 = await request(app)
      .patch("/api/user/contact/")
      .send({ user_id: poppy_id, emergencyContactEmail: "jim@email.com", field: "delete" })
      const newPoppy = await User.findOne({name: "poppy"})
      expect(newPoppy.emergencyContacts.length).toBe(0);
  })
  test("it throws error if removing non-existing contact", async () => {
    const poppy = await User.findOne({name: "poppy"})
    const poppy_id = poppy._id
    let response = await request(app)
      .patch("/api/user/contact/")
      .send({ user_id: poppy_id, emergencyContactEmail: "bob@email.com", field: "delete" });
      expect(response.statusCode).toBe(400);
  })
  test("it throws error if adding non-existing user", async () => {
    const poppy = await User.findOne({name: "poppy"})
    const poppy_id = poppy._id
    let response = await request(app)
      .patch("/api/user/contact/")
      .send({ user_id: poppy_id, emergencyContactEmail: "bob@email.com", field: "add" });
      expect(response.statusCode).toBe(400);
  })
  test("getEmergencyContacts method status 200 if user exists", async () => {
    const poppy = await User.findOne({name: "poppy"})
    const poppy_id = poppy._id
    let response = await request(app)
      .get("/api/user/contacts/" + poppy_id)
      expect(response.statusCode).toBe(200);
  })
  test("getEmergencyContacts method retireves a users contacts", async () => {
    const poppy = await User.findOne({name: "poppy"})
    const poppy_id = poppy._id
    let response = await request(app)
    .patch("/api/user/contact/")
    .send({ user_id: poppy_id, emergencyContactEmail: "jim@email.com", field: "add" })
    let response2 = await request(app)
      .get("/api/user/contacts/" + poppy_id)
      expect(response2.body.emergencyContacts.length).toBe(1);
  })
  test("getEmergencyContacts method status 404 if user doesn't exist", async () => {
    let response = await request(app)
      .get("/api/user/contacts/sakjhcbaskjhcbs")
      expect(response.statusCode).toBe(404);
  })
  test("it searches for a user using given search query", async () => {
    let response = await request(app)
      .get("/api/user/contacts/search/ema")
      expect(response.statusCode).toBe(200);
  })
  // test("it returns users that match the search", async () => {
  //   let response = await request(app)
  //     .get("/api/user/contacts/search/ema")
  //     expect(response.data).toBe(200);
  // })
});
