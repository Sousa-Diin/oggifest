class PermissionRepository extends BaseRepository {
  constructor() {
    super( 
      'permissions', 
      ['id','role', 'page', 'create', 'read', 'update', 'delete', 'cancel', 'config','criacao']
    ); // Nome da aba
  }

  create(data){
    return super.create(data, 'id');
  }

  hasPermission(role, page, action) {
    const data = this.getAll();

    for (let row of data) {
      const rowRole = row.role;
      const rowPage = row.page;
      const isAllowed = row[action]; // true ou false

      if ((rowRole === role || rowRole === 'all') &&
          (rowPage === page || rowPage === 'all')) {
        return isAllowed === true;
      }
    }

    return false;
  }
}

