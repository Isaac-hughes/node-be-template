const mongoose = require('mongoose');
const User = require('../../../src/models/user.model');

/**
 * Test Suite for User Model
 *
 * Tests CRUD operations and validations for the User model:
 * - Create: Test user creation with valid and invalid data
 * - Read: Test fetching users by different criteria
 * - Update: Test updating user fields
 * - Delete: Test user deletion
 */

// Helper function to create a valid user object
const createValidUserData = () => ({
  email: 'test@example.com',
  password: 'Password123!',
  firstName: 'John',
  lastName: 'Doe',
});

describe('User Model CRUD Operations', () => {
  // Clear users after each test
  afterEach(async () => {
    await User.deleteMany({});
  });

  /**
   * CREATE Tests
   */
  describe('Create Operations', () => {
    it('should successfully create a user with valid data', async () => {
      const validUser = new User(createValidUserData());
      const savedUser = await validUser.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.email).toBe(validUser.email);
      expect(savedUser.firstName).toBe(validUser.firstName);
      expect(savedUser.lastName).toBe(validUser.lastName);
      // Password should be hashed - just check it's not the original
      expect(savedUser.password).not.toBe(createValidUserData().password);
    });

    it('should fail to create user with duplicate email', async () => {
      // Create first user
      await new User(createValidUserData()).save();

      // Attempt to create duplicate user
      const duplicateUser = new User(createValidUserData());

      await expect(duplicateUser.save()).rejects.toThrow(/duplicate key error/);
    });

    it('should fail to create user without required fields', async () => {
      const userWithoutRequired = new User({
        firstName: 'John',
      });

      await expect(userWithoutRequired.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });
  });

  /**
   * READ Tests
   */
  describe('Read Operations', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await new User(createValidUserData()).save();
    });

    it('should find user by ID', async () => {
      const foundUser = await User.findById(testUser._id);
      expect(foundUser.email).toBe(testUser.email);
    });

    it('should find user by email', async () => {
      const foundUser = await User.findOne({ email: testUser.email });
      expect(foundUser._id.toString()).toBe(testUser._id.toString());
    });

    it('should return null for non-existent ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const foundUser = await User.findById(nonExistentId);
      expect(foundUser).toBeNull();
    });
  });

  /**
   * UPDATE Tests
   */
  describe('Update Operations', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await new User(createValidUserData()).save();
    });

    it('should update user firstName', async () => {
      const updatedUser = await User.findByIdAndUpdate(
        testUser._id,
        { firstName: 'Jane' },
        { new: true }
      );

      expect(updatedUser.firstName).toBe('Jane');
      expect(updatedUser.email).toBe(testUser.email); // Other fields unchanged
    });

    it('should fail to update email to existing email', async () => {
      // Create another user
      await new User({
        ...createValidUserData(),
        email: 'another@example.com',
      }).save();

      // Try to update first user's email to the second user's email
      await expect(
        User.findByIdAndUpdate(
          testUser._id,
          { email: 'another@example.com' },
          { new: true, runValidators: true }
        )
      ).rejects.toThrow(/duplicate key error/);
    });
  });

  /**
   * DELETE Tests
   */
  describe('Delete Operations', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await new User(createValidUserData()).save();
    });

    it('should delete user by ID', async () => {
      await User.findByIdAndDelete(testUser._id);
      const deletedUser = await User.findById(testUser._id);
      expect(deletedUser).toBeNull();
    });

    it('should return null when deleting non-existent user', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const result = await User.findByIdAndDelete(nonExistentId);
      expect(result).toBeNull();
    });
  });
});
