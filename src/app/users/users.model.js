const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("../../plugins");
const { roles } = require("../../config/roles");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true
    },

    email: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      sparse: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      }
    },
    password: {
      type: String,
      required: false,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
      private: true // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: "user"
    },
    status: {
      type: String,
      default: "1"
    },
    verified: {
      type: String,
      default: "0"
    },
    ROI: {
      type: Number,
      default: 0
    },
    annualROI: {
      type: Number,
      default: 0
    },
    predCount: {
      type: Number,
      default: 0
    },
    otp: {
      otpvalue: {
        type: String
      },
      generatedDate: {
        type: String
      }
    },

    picture: {
      type: String
    },
    googleId: {
      type: String
    },
    facebookId: {
      type: String
    },
    provider: {
      type: String,
      enum: ["GOOGLE", "FACEBOOK"]
    }
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
// userSchema.plugin(require("mongoose-autopopulate"));
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });

  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

/**
 * Check is admin
 * @param {string} role
 * @returns {Promise<boolean>}
 */
userSchema.methods.isAdmin = async function (role) {
  const user = this;
  return user.role == role ? true : false;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model("User", userSchema);

module.exports = User;
