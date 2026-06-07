export const parseQuery = (req, res, next) => {
  const queryObj = { ...req.query };
  const excludeFields = ['_sort', '_order', '_limit', '_page', '_end', '_start'];
  
  const filter = {};
  
  for (const [key, val] of Object.entries(queryObj)) {
    if (excludeFields.includes(key)) continue;
    
    // Handle id_ne (not equal filter for ids, e.g. excluding active product in related products list)
    if (key === 'id_ne') {
      filter.id = { ...filter.id, $ne: val };
    } 
    // Handle regular filters
    else {
      if (val === 'true') {
        filter[key] = true;
      } else if (val === 'false') {
        filter[key] = false;
      } else if (!isNaN(val) && val.trim() !== '' && ['rating', 'reviews', 'price', 'qty', 'total'].includes(key)) {
        filter[key] = Number(val);
      } else {
        filter[key] = val;
      }
    }
  }
  
  // Sorting: e.g. _sort=rating&_order=desc
  const sort = {};
  if (req.query._sort) {
    const sortField = req.query._sort;
    const sortOrder = req.query._order && req.query._order.toLowerCase() === 'desc' ? -1 : 1;
    sort[sortField] = sortOrder;
  }
  
  // Limit: e.g. _limit=4
  let limit = 0;
  if (req.query._limit) {
    limit = parseInt(req.query._limit, 10);
  }
  
  req.mongoFilter = filter;
  req.mongoSort = sort;
  req.mongoLimit = limit;
  
  next();
};
