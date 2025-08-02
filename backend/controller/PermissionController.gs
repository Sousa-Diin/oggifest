const PAGES = {
  LOGIN: 0,
  CALENDAR: 1,
  APPOINTMENTS: 2,
  VIEWS: 3,
  CLIENT: 4,
  CHART: 5,
  CONFIG: 6
}


//sudo----------root =====> [config, create, read, update, delete, cancel]["all pages"]
//admin---------manager ==> [create, read, update, cancel][0, 1, 2, 4]
//system--------operator => [create, read, update][0, 1, 2]
//viewer--------Visitor===> [read][0, 1]

//SELECT * FROM permissoes WHERE role='admin' AND page=1

const superUser = { 
  id: null,
  role:'root', 
  page:'all', 
  create: true, 
  read: true, 
  update: true, 
  delete: true, 
  cancel: true, 
  config: true,
  criacao: ""
};

const admin = { 
  id: null,
  role:'operator', 
  page: PAGES.LOGIN,
  create: true, 
  read: true, 
  update: true, 
  delete: false, 
  cancel: true, 
  config: false,
  criacao: ""
};

function getRoleByAlias(alias) {
  const props = PropertiesService.getScriptProperties();
  return props.getProperty(alias);
}

function logAllProperties() {
  const props = PropertiesService.getScriptProperties().getProperties();
 Logger.log(JSON.stringify(props, null, 2));
}


function setAllRoles(objRoles) {
  const props = PropertiesService.getScriptProperties();
  props.setProperties(objRoles);
}

function seedPermissions(data) {
    const permissions = new PermissionRepository();
    permissions.create(data,'role');
  }

function initPermissionsConfig(){
  
  //setProperKey('ROOT_MAIL',"augustowildes@gmail.com");

  /* setAllRoles(
    {
      root: 'sudo',
      manager: 'admin',
      operator: 'system',
      visitor: 'viewer'
    }
  ); */
  
  seedPermissions(admin);
  logAllProperties();
  Logger.log("Alias.: " + getRoleByAlias(superUser.role));
}
