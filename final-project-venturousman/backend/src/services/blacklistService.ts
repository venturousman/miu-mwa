import { Schema } from 'mongoose';
import { BlacklistModel } from '../models/blacklistModel';

async function blacklistToken(
    jti: String,
    ttlInSeconds: number,
    userId: Schema.Types.ObjectId | null = null,
    reason: String | null = null,
) {
    const expiresAt = new Date(Date.now() + ttlInSeconds * 1000);
    return BlacklistModel.create({ jti, userId, reason, expiresAt });
}

async function isTokenBlacklisted(jti: String) {
    return BlacklistModel.exists({ jti });
}

export default {
    blacklistToken,
    isTokenBlacklisted,
};
