import { Component, OnInit } from '@angular/core';
import { RoleService } from './role.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '../service/shared.service';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  roles: any = [];
  role: any;
  permisions: any = [];
  existingPermision: any = [];
  temp_var: boolean;
  whichForm: any = 'viewRole';
  checkedPermision: any = [];
  allCheckedPermision: any = [];
  updatedPermision: any = [];
  public data;
  public filterQuery = '';
  public rowsOnPage = 10;
  public sortBy = 'email';
  public sortOrder = 'asc';
  roleForm: FormGroup;
  editRoleForm: FormGroup;
  pages: any;
  pageNum: any;
  firstPage: any;
  lastPage: any;
  pageNumber: any;
  indexPassed: number;
  canAddRole: Boolean = false;

  constructor(private roleService: RoleService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.whichForm = 'viewRole';
    // this.isMainMerchant = this.sharedService.getIsMainMerchant();
    // this.isMainMerchant
    const permisions =  this.sharedService.getUserPermistions();
    permisions.forEach(element => {
      if (element === 'role_index') {
        this.canAddRole = true;
      }
    });
    this.temp_var = true;
    this.getAllRoles();
    this.roleForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'description': ['', Validators.required],
      'isHidden': ['', Validators.required],
      'status': [''],
    });
  }
  getAllRoles(pageNum = 0) {
    this.pageNum = pageNum;
    const pageSize = 10;
    if (this.pageNum > 1) {
      this.indexPassed = (pageSize * (this.pageNum - 1)) + 1;
    } else {
      this.indexPassed = pageNum;
    }
    this.spinner.show();
    this.roleService.viewAllRoles(pageSize, pageNum).subscribe(response => {
    this.spinner.hide();
      this.roles = response.data;
      this.pageNumber = this.roles.pageNumber;
      this.lastPage = this.roles.last;
      const returnedPageSize = this.roles.totalPages - 1;
      const pageNumberArray = [];
      let i = 1;
      for (i = 1; i <= returnedPageSize; i++) {
        pageNumberArray.push(i);
      }
      this.pages = pageNumberArray;
    }, error => {
      this.spinner.hide();
    });
  }
  viewRole(role) {
    this.spinner.show();
    this.roleService.viewAllRole(role.uniqueKey).subscribe(response => {
    this.spinner.hide();
      this.whichForm = 'viewRoleDetail';
      this.viewPermisions();
      this.role = response.data.role;
      this.existingPermision = response.data.permissions;
      this.roleForm.setValue({
        'name': this.role.name,
        'description': this.role.description,
        'isHidden': (this.role.isHidden === 'ACTIVE') ? true : false,
        'status': (this.role.status === 'ACTIVE') ? true : false,
      });
      this.whichForm = 'viewRoleDetail';
    }, error => {
      this.spinner.hide();
    });
  }
  addNewRole() {
    this.viewPermisions();
    this.whichForm = 'addNewRole';
  }
  viewPermisions() {
    this.spinner.show();
    this.roleService.viewPermisions().subscribe(response => {
      this.spinner.hide();
      this.permisions = response.data.permissions;
    }, error => {
      this.spinner.hide();
    });
  }
  addRole() {
    if (this.roleForm.invalid) {
      this.sharedService.swalAlertMessage('Add New Role', 'All feild are required', 'info');
      return;
    }
    const requestBody = {
      'name': this.roleForm.value.name,
      'description': this.roleForm.value.description,
      'permissionIds': this.allCheckedPermision,
      'isHidden': (this.roleForm.value.isHidden === true) ? 'ACTIVE' : 'INACTIVE'
    };
    this.spinner.show();
    this.roleService.addRole(requestBody).subscribe(response => {
    this.spinner.hide();
      this.permisions = response.data.permissions;
      this.sharedService.swalAlertMessage('Add New Role', 'Role created successfully', 'success');
      this.goBack();
    });
  }
  goBack() {
    this.getAllRoles();
    this.whichForm = 'viewRole';
  }
  updateRole() {
    if (this.roleForm.invalid) {
      this.sharedService.swalAlertMessage('Update Role', 'All feild are required', 'info');
      return;
    }
    const updatedPermision = (this.allCheckedPermision !== undefined || this.allCheckedPermision.lenght < 0) ?
      this.existingPermision : this.allCheckedPermision;
    const requestBody = {
      'name': this.roleForm.value.name,
      'description': this.roleForm.value.description,
      'permissionIds': updatedPermision,
      'status': (this.roleForm.value.status === true) ? 'ACTIVE' : 'INACTIVE',
      'isHidden': (this.roleForm.value.isHidden === true) ? 'ACTIVE' : 'INACTIVE'
    };
    this.spinner.show();
    this.roleService.updateRole(requestBody, this.role.uniqueKey).subscribe(response => {
    this.spinner.hide();
      if (response.body.status === 'SUCCESS') {
        swal({
          title: 'Update Role',
          text: 'Role updated successfully',
          type: 'success',
          confirmButtonText: 'Ok',
          customClass: 'sweet-alert',
          allowOutsideClick: false
        }).then(() => {
          this.goBack();
        });
      }
    }, error => {
      this.handleErrors(error);
    });
  }
  checkedPermisionSelection(ev, id) {
    if (ev.target.checked === true) {
      this.checkedPermision.push(id);
    } else {
      const i = this.checkedPermision.indexOf(id);
      this.checkedPermision.splice(i, 1);
    }
    this.allCheckedPermision = this.checkedPermision;
  }
  selectedPermision(ev, id) {
    if (ev.target.checked === true) {
      this.existingPermision.push(id);
    } else {
      const i = this.existingPermision.indexOf(id);
      this.existingPermision.splice(i, 1);
    }
    this.allCheckedPermision = this.existingPermision;
  }

  handleErrors(error) {
    let errorMessage;
    if (error.status === 'FAILED' && error.error === 'PROCESSING') {
      errorMessage = 'An error occured';
    } else if (error.status === 'FAILED') {
      errorMessage = error.message;
    }
    this.sharedService.swalAlertMessage('Error!', errorMessage, 'error');
  }
}
