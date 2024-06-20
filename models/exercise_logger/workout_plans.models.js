import mongoose from 'mongoose'

const PlanSchema = new mongoose.Schema({
    plan_type: {
        type: String,
        required: true,
    },
    plan_name: {
        type: String,
        required: true,
    },
    plan_intensity:{
        type: Number,
        required: true
    },
    plan_count:{
        type: Number,
        default: 0
    }
}, {timestamps: true})

export const Plan = mongoose.model("Plan", PlanSchema)