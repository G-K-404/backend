import mongoose from 'mongoose'

const PlanTypeSchema = new mongoose.Schema({
    plan_type: {
        type: String,
        required: true,
        unique: true
    },
    plan_name: {
        type: String,
        required: true,
    },
    plan_type_count:{
        type: Number,
        default: 0
    }
})

export const PlanType = mongoose.model("Plan", PlanTypeSchema)