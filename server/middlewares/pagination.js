export const getPagination = function(page, limit){
    const tPage = Math.max(parseInt(page, 10) || 1, 1);
    const tLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const tSkip = (tPage - 1)* tLimit;
    return {tPage, tLimit, tSkip};
};