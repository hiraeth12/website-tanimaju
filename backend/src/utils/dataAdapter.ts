// Adapter untuk mengubah struktur data MySQL agar kompatibel dengan frontend
export const adaptMySQLToMongo = (mysqlData: any) => {
  if (Array.isArray(mysqlData)) {
    return mysqlData.map(item => ({
      ...item,
      _id: item.id?.toString() || item._id?.toString() || '',
      id: undefined // Remove MySQL id to avoid confusion
    }));
  } else {
    return {
      ...mysqlData,
      _id: mysqlData.id?.toString() || mysqlData._id?.toString() || '',
      id: undefined // Remove MySQL id to avoid confusion
    };
  }
};

// Adapter untuk mengubah ID dari frontend (_id) ke format MySQL (id)
export const adaptMongoToMySQL = (mongoId: string): number => {
  const id = parseInt(mongoId);
  if (isNaN(id)) {
    throw new Error(`Invalid ID format: ${mongoId}`);
  }
  return id;
};
