import mongoose from 'mongoose'

const PlanIntenSchema = new mongoose.Schema({
    plan_freq_weekly: {
        type: Number,
        required: true,
        unique: true
    },
    plan_intensity_count:{
        type: Number,
        default: 0
    }
}, {timestamps: true})

export const PlanInstensity = mongoose.model("PlanIntensity", PlanSchema)