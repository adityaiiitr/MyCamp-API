const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});


// Course Aggregation is not working so middleware is implemented in the controller itself

// Static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function(bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ]);
  console.log(obj)

  const averageCost = obj[0]
    ? Math.ceil(obj[0].averageCost / 10) * 10
    : undefined;
  // try {
  //   await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
  //     averageCost,
  //   });
  try {
    const Bootcamp = mongoose.model('Bootcamp');
    await Bootcamp.findByIdAndUpdate(bootcampId, {
        averageCost,
    });
  } catch (err) {
    console.log(err);
  }
};

// Call getAverageCost after save
CourseSchema.post('save', async function() {
  console.log(`Adding AverageCost Before Saving`)
  // await this.constructor.getAverageCost(this.bootcamp);
  const bootcampId = this.bootcamp
  console.log(typeof(bootcampId))

  const obj = await this.model('Course').aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ]);
  console.log(obj)


  const averageCost = obj[0]
    ? Math.ceil(obj[0].averageCost / 10) * 10
    : undefined;
  // try {
  //   await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
  //     averageCost,
  //   });
  try {
    const Bootcamp = mongoose.model('Bootcamp');
    await Bootcamp.findByIdAndUpdate(bootcampId, {
        averageCost,
    });
  } catch (err) {
    console.log(err);
  }
});

// Call getAverageCost after remove
CourseSchema.post('findOneAndDelete', async function () {
  console.log(`Adding AverageCost After Deletion`)
  // await this.model('Course').getAverageCost(this.bootcamp); // this construvtor is not a funtion aisa kuch error aa rha hai.... theek kerdo koi....
  // const bootcampId = this.bootcamp
  const bootcampId = this.getFilter()["_id"]

  console.log(`Bootcamp : ${bootcampId}`)
  const obj = await this.model('Course').aggregate([
    {
      $match: { bootcamp: new mongoose.Types.ObjectId(bootcampId) }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ]);
  console.log(obj)


  const averageCost = obj[0]
    ? Math.ceil(obj[0].averageCost / 10) * 10
    : undefined;
  // try {
  //   await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
  //     averageCost,
  //   });
  try {
    const Bootcamp = mongoose.model('Bootcamp');
    await Bootcamp.findByIdAndUpdate(bootcampId, {
        averageCost,
    });
  } catch (err) {
    console.log(err);
  }
});
 
// // Call getAverageCost after tuition update
// CourseSchema.post("findOneAndUpdate", async function (doc) {
//   if (this.tuition != doc.tuition) {
//     await doc.constructor.getAverageCost(doc.bootcamp);
//   }
// });

module.exports = mongoose.model('Course', CourseSchema);
