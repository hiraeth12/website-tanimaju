// Field mapping adapters untuk setiap entitas
export const adaptTanamanMySQLToMongo = (mysqlData: any) => {
  if (Array.isArray(mysqlData)) {
    return mysqlData.map(item => ({
      _id: item.id?.toString() || '',
      namaTanaman: item.nama,
      pupuk: item.jenis,
      deskripsi: item.deskripsi,
      perawatan: item.perawatan,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  } else {
    return {
      _id: mysqlData.id?.toString() || '',
      namaTanaman: mysqlData.nama,
      pupuk: mysqlData.jenis,
      deskripsi: mysqlData.deskripsi,
      perawatan: mysqlData.perawatan,
      created_at: mysqlData.created_at,
      updated_at: mysqlData.updated_at
    };
  }
};

export const adaptTanamanMongoToMySQL = (mongoData: any) => {
  return {
    nama: mongoData.namaTanaman,
    jenis: mongoData.pupuk,
    deskripsi: mongoData.deskripsi,
    perawatan: mongoData.perawatan
  };
};

export const adaptBibitMySQLToMongo = (mysqlData: any) => {
  if (Array.isArray(mysqlData)) {
    return mysqlData.map(item => ({
      _id: item.id?.toString() || '',
      tanaman: item.nama,
      sumber: item.sumber,
      namaPenyedia: item.nama_penyedia,
      tanggalPemberian: item.tanggal_pemberian,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  } else {
    return {
      _id: mysqlData.id?.toString() || '',
      tanaman: mysqlData.nama,
      sumber: mysqlData.sumber,
      namaPenyedia: mysqlData.nama_penyedia,
      tanggalPemberian: mysqlData.tanggal_pemberian,
      created_at: mysqlData.created_at,
      updated_at: mysqlData.updated_at
    };
  }
};

export const adaptPanenMySQLToMongo = (mysqlData: any) => {
  if (Array.isArray(mysqlData)) {
    return mysqlData.map(item => ({
      _id: item.id?.toString() || '',
      date: item.tanggal_panen,
      farmer: item.petani_nama || item.petani_id,
      plant: item.tanaman_nama || item.tanaman_id,
      amount: item.jumlah,
      salesStatus: item.status_penjualan,
      buyerName: item.nama_pembeli,
      field: item.lahan || 'Default Field', // Use actual lahan value
      seedProvider: item.bibit_nama_penyedia || 'Default Provider', // Use actual bibit nama penyedia
      fertilizer: item.pupuk || 'Default Fertilizer', // Use actual pupuk value
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  } else {
    return {
      _id: mysqlData.id?.toString() || '',
      date: mysqlData.tanggal_panen,
      farmer: mysqlData.petani_nama || mysqlData.petani_id,
      plant: mysqlData.tanaman_nama || mysqlData.tanaman_id,
      amount: mysqlData.jumlah,
      salesStatus: mysqlData.status_penjualan,
      buyerName: mysqlData.nama_pembeli,
      field: mysqlData.lahan || 'Default Field',
      seedProvider: mysqlData.bibit_nama_penyedia || 'Default Provider',
      fertilizer: mysqlData.pupuk || 'Default Fertilizer',
      created_at: mysqlData.created_at,
      updated_at: mysqlData.updated_at
    };
  }
};
