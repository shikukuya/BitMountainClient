/**
 * 根据分数计算等级
 * by littlefean
 */
export function computeLevel(score) {
    if (score === null || score === undefined) {
        return 1;
    }
    if (score < 100) {
        return 1;
    }
    if (score < 200) {
        return 2;
    }
    if (score < 300) {
        return 3;
    }
    if (score < 400) {
        return 4;
    }
    if (score < 500) {
        return 5;
    }
    if (score < 600) {
        return 6;
    }
    if (score > 600) {
        return 7;
    }
    return 7;
}

export function getLevelName(score) {
    let level = computeLevel(score);
    return ["青铜", "黑铁", "白银", "黄金", "铂金", "钻石", "黑客"][level - 1];
}
