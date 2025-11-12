const mongoose = require('mongoose');
const slugify = require('slugify');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Book title is required"],
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    author: {
        type: String,
        required: [true, "Author name is required"],
        trim: true,
    },
    publisher: {
        type: String,
        trim: true,
    },
    isbn: {
        type: String,
        unique: true,
        required: [true, "ISBN code is required"],
    },
    totalCopies: {
        type: Number,
        default: 1,
        min: 0,
    },
    availableCopies: {
        type: Number,
        default: 1,
        min: 0,
    },
    borrowedCount: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        trim: true,
    },
    coverImage: {
        type: String, // path or URL (handled by multer)
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });


// Generate slug before save
bookSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = slugify(this.title, {
            lower: true,
            replacement: "-",
            strict: true,
            trim: true,
        });
    }
    next();
});


// Prevent duplicate slug
bookSchema.pre("save", async function (next) {
    const exists = await this.constructor.findOne({ slug: this.slug });
    if (exists && exists._id.toString() !== this._id.toString()) {
        const err = new Error("Book title already exists!");
        err.statusCode = 400;
        return next(err);
    }
    next();
});


// Update slug on title change
bookSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update.title) {
        update.slug = slugify(update.title, {
            lower: true,
            strict: true,
            trim: true,
        });
        this.setUpdate(update);
    }
    next();
});


// Helper method for borrow and return
bookSchema.methods.borrowBook = function () {
    if (this.availableCopies > 0) {
        this.availableCopies -= 1;
        this.borrowedCount += 1;
        this.isAvailable = this.availableCopies > 0;
    } else {
        throw new Error("No available copies left!");
    }
};

bookSchema.methods.returnBook = function () {
    this.availableCopies += 1;
    this.isAvailable = true;
};

module.exports = mongoose.models.Book || mongoose.model("Book", bookSchema);
