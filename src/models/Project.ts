import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type LinkType =
  | "github"
  | "firebase"
  | "supabase"
  | "mongodb"
  | "vercel"
  | "live"
  | "docs"
  | "other";

export interface IProjectLink {
  _id?: string | Types.ObjectId;
  type: LinkType;
  label?: string;
  url: string;
}

export interface IProjectNote {
  _id?: string | Types.ObjectId;
  content: string;
  createdAt: Date | string;
}

export type TaskStatus = "planned" | "in-progress" | "completed";

export interface IProjectTask {
  _id?: string | Types.ObjectId;
  title: string;
  status: TaskStatus;
  createdAt: Date | string;
}

export type ProjectStatus = "active" | "inactive" | "on-hold" | "completed";
export type ProjectCategory = "personal" | "client";

export interface IProject {
  _id?: string | Types.ObjectId;
  name: string;
  description: string;
  category: ProjectCategory;
  clientName?: string;
  status: ProjectStatus;
  pinned?: boolean;
  links: IProjectLink[];
  notes: IProjectNote[];
  tasks: IProjectTask[];
  tags: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IProjectDocument extends Document, Omit<IProject, "_id"> {
  _id: Types.ObjectId;
}

const ProjectLinkSchema = new Schema<IProjectLink>(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "github",
        "firebase",
        "supabase",
        "mongodb",
        "vercel",
        "live",
        "docs",
        "other",
      ],
      default: "github",
    },
    label: {
      type: String,
      trim: true,
      default: "",
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: true }
);

const ProjectNoteSchema = new Schema<IProjectNote>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const ProjectTaskSchema = new Schema<IProjectTask>(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Task title cannot exceed 200 characters"],
    },
    status: {
      type: String,
      enum: ["planned", "in-progress", "completed"],
      default: "planned",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const ProjectSchema = new Schema<IProjectDocument>(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [120, "Name cannot exceed 120 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      enum: ["personal", "client"],
      default: "personal",
    },
    clientName: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "on-hold", "completed"],
      default: "active",
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    links: {
      type: [ProjectLinkSchema],
      default: [],
    },
    notes: {
      type: [ProjectNoteSchema],
      default: [],
    },
    tasks: {
      type: [ProjectTaskSchema],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Project: Model<IProjectDocument> =
  mongoose.models.Project ||
  mongoose.model<IProjectDocument>("Project", ProjectSchema);
