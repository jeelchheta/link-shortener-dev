import { Types } from "mongoose";
import LinkModel, {} from "../models/Link.js";
import { Status } from "../types/index.js";
export async function createLinkBL(req, shortCode) {
    try {
        const link = await LinkModel.create({
            originalUrl: req.body.originalUrl,
            shortCode: shortCode,
            userid: req.userinfo?.id,
            tags: Array.isArray(req?.body?.tags) ? req?.body?.tags?.slice(0, 5) : [],
            expiresAt: req?.body?.expiresAt || undefined,
        }).then(link => {
            return {
                "_id": link._id,
                "originalUrl": link.originalUrl,
                "shortCode": link.shortCode,
                "clicks": link.clicks,
                "tags": link.tags,
                "isActive": link.isActive,
                "expiresAt": link.expiresAt,
                "status": link.status,
                "createdAt": link.createdAt,
            };
        });
        return link;
    }
    catch (err) {
        throw err;
    }
}
export async function getMyLinksBL(req) {
    try {
        return await LinkModel.find({ userid: req.userinfo?.id, status: Status.Active })
            .select(`originalUrl shortCode clicks tags isActive expiresAt status createdAt`)
            .sort({ createdAt: -1 });
    }
    catch (err) {
        throw err;
    }
}
export async function deleteLinkBL(req) {
    try {
        await LinkModel.findOneAndUpdate({
            _id: req.params.id,
            userid: req.userinfo?.id
        }, {
            $set: {
                status: Status.Deleted
            }
        });
    }
    catch (err) {
        throw err;
    }
}
export async function getStatsBL(req) {
    try {
        const stats = await LinkModel.aggregate([
            {
                $match: {
                    userid: new Types.ObjectId(req.userinfo?.id),
                    status: Status.Active,
                },
            },
            {
                $facet: {
                    // =========================
                    // STATS
                    // =========================
                    stats: [
                        {
                            $group: {
                                _id: null,
                                totalLinks: { $sum: 1 },
                                totalClicks: { $sum: "$clicks" },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                totalLinks: 1,
                                totalClicks: 1,
                            },
                        },
                    ],
                    // =========================
                    // TOP 5 LINKS
                    // =========================
                    topLinks: [
                        {
                            $sort: {
                                clicks: -1,
                            },
                        },
                        {
                            $limit: 5,
                        },
                        {
                            $project: {
                                originalUrl: 1,
                                shortCode: 1,
                                createdAt: 1,
                                url: 1,
                            },
                        },
                    ],
                    // =========================
                    // DAILY CLICKS
                    // =========================
                    series: [
                        {
                            $unwind: {
                                path: "$clickHistory",
                                preserveNullAndEmptyArrays: false,
                            },
                        },
                        {
                            $group: {
                                _id: {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: "$clickHistory.date",
                                    },
                                },
                                clicks: {
                                    $sum: 1,
                                },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                data: {
                                    $push: {
                                        date: "$_id",
                                        clicks: "$clicks",
                                    },
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                data: 1,
                                series: {
                                    $map: {
                                        input: {
                                            $range: [0, 14],
                                        },
                                        as: "day",
                                        in: {
                                            $let: {
                                                vars: {
                                                    currentDate: {
                                                        $dateToString: {
                                                            format: "%Y-%m-%d",
                                                            date: {
                                                                $dateSubtract: {
                                                                    startDate: "$$NOW",
                                                                    unit: "day",
                                                                    amount: {
                                                                        $subtract: [13, "$$day"],
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                                in: {
                                                    date: "$$currentDate",
                                                    clicks: {
                                                        $let: {
                                                            vars: {
                                                                matched: {
                                                                    $arrayElemAt: [
                                                                        {
                                                                            $filter: {
                                                                                input: "$data",
                                                                                as: "item",
                                                                                cond: {
                                                                                    $eq: [
                                                                                        "$$item.date",
                                                                                        "$$currentDate",
                                                                                    ],
                                                                                },
                                                                            },
                                                                        },
                                                                        0,
                                                                    ],
                                                                },
                                                            },
                                                            in: {
                                                                $ifNull: [
                                                                    "$$matched.clicks",
                                                                    0,
                                                                ],
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        {
                            $project: {
                                series: 1,
                            },
                        },
                    ],
                },
            },
            // =========================
            // FORMAT RESPONSE
            // =========================
            {
                $project: {
                    totalLinks: {
                        $ifNull: [
                            { $arrayElemAt: ["$stats.totalLinks", 0] },
                            0,
                        ],
                    },
                    totalClicks: {
                        $ifNull: [
                            { $arrayElemAt: ["$stats.totalClicks", 0] },
                            0,
                        ],
                    },
                    series: {
                        $ifNull: [
                            { $arrayElemAt: ["$series.series", 0] },
                            [],
                        ],
                    },
                    topLinks: 1,
                },
            },
        ]);
        return stats[0];
    }
    catch (err) {
        throw err;
    }
}
export async function getLinkAnalyticsBL(req) {
    try {
        const linkanalytics = await LinkModel.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(req.params.id?.toString()),
                    userid: new Types.ObjectId(req.userinfo?.id),
                    status: Status.Active
                }
            },
            {
                $facet: {
                    link: [
                        {
                            $limit: 1,
                        },
                        {
                            $project: {
                                originalUrl: 1,
                                shortCode: 1,
                                clicks: 1,
                                tags: 1,
                                isActive: 1,
                                expiresAt: 1,
                                status: 1,
                                createdAt: 1
                            },
                        },
                    ],
                    series: [
                        {
                            $unwind: {
                                path: "$clickHistory",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $group: {
                                _id: {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: "$clickHistory.date",
                                        timezone: "UTC",
                                    },
                                },
                                clicks: {
                                    $sum: {
                                        $cond: [
                                            { $ne: ["$clickHistory.date", null] },
                                            1,
                                            0,
                                        ],
                                    },
                                },
                            },
                        },
                        {
                            $match: {
                                _id: {
                                    $ne: null,
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                date: "$_id",
                                clicks: 1,
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                data: {
                                    $push: "$$ROOT",
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                data: 1,
                            },
                        },
                        // Generate the last 14 days
                        {
                            $set: {
                                dates: {
                                    $map: {
                                        input: {
                                            $range: [0, 14],
                                        },
                                        as: "day",
                                        in: {
                                            $dateToString: {
                                                format: "%Y-%m-%d",
                                                date: {
                                                    $dateSubtract: {
                                                        startDate: "$$NOW",
                                                        unit: "day",
                                                        amount: {
                                                            $subtract: [13, "$$day"],
                                                        },
                                                    },
                                                },
                                                timezone: "UTC",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        {
                            $unwind: "$dates",
                        },
                        {
                            $project: {
                                date: "$dates",
                                clicks: {
                                    $let: {
                                        vars: {
                                            matched: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: "$data",
                                                            as: "item",
                                                            cond: {
                                                                $eq: ["$$item.date", "$dates"],
                                                            },
                                                        },
                                                    },
                                                    0,
                                                ],
                                            },
                                        },
                                        in: {
                                            $ifNull: ["$$matched.clicks", 0],
                                        },
                                    },
                                },
                            },
                        },
                        {
                            $sort: {
                                date: 1,
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    link: {
                        $arrayElemAt: ["$link", 0],
                    },
                    series: 1,
                },
            }
        ]);
        return linkanalytics[0];
    }
    catch (err) {
        throw err;
    }
}
//# sourceMappingURL=linkBL.js.map