import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Ant Design
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';




@Component({
  selector: 'app-user-form',
  imports: [NzButtonModule, NzModalModule, NzSelectModule, NzFormModule, NzInputModule, CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnChanges {
  @Input() isVisible = false;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() userSaved = new EventEmitter<any>();
  @Input() userData: any = null;

  isEditMode = false;
  formTitle = 'Thêm người dùng mới';

  user = {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'daotaohieu@gmail.com',
    phone: '0912345678',
    password: '123456',
    passwordConfirm: '123456',
    role: 'user',
    status: 'active'
  };

  ngOnChanges(changes: SimpleChanges): void {
    // Kiểm tra khi modal mở và có dữ liệu người dùng
    if (changes['isVisible'] && changes['isVisible'].currentValue === true) {
      // Reset form về trạng thái ban đầu
      this.userForm.reset({
        role: 'user',
        status: 'active'
      });

      // Nếu có userData thì đây là chế độ chỉnh sửa
      if (this.userData) {
        this.isEditMode = true;
        this.formTitle = 'Chỉnh sửa người dùng';

        // Điền dữ liệu người dùng vào form
        this.userForm.patchValue({
          name: this.userData.name,
          email: this.userData.email,
          phone: this.userData.phone,
          role: this.userData.role,
          status: this.userData.status
        });

        // Trong chế độ chỉnh sửa, không bắt buộc nhập mật khẩu
        const passwordControl = this.userForm.get('password');
        const passwordConfirmControl = this.userForm.get('passwordConfirm');

        if (passwordControl && passwordConfirmControl) {
          passwordControl.clearValidators();
          passwordControl.updateValueAndValidity();

          passwordConfirmControl.clearValidators();
          passwordConfirmControl.updateValueAndValidity();
        }
      } else {
        // Chế độ thêm mới
        this.isEditMode = false;
        this.formTitle = 'Thêm người dùng mới';

        // Đặt lại validators cho mật khẩu
        const passwordControl = this.userForm.get('password');
        const passwordConfirmControl = this.userForm.get('passwordConfirm');

        if (passwordControl && passwordConfirmControl) {
          passwordControl.setValidators([Validators.required, Validators.minLength(6)]);
          passwordControl.updateValueAndValidity();

          passwordConfirmControl.setValidators([Validators.required, Validators.minLength(6)]);
          passwordConfirmControl.updateValueAndValidity();
        }
      }
    }
  }

  showModal(): void {
    this.isVisible = true;
    this.userForm.reset();
    // Đặt giá trị từ đối tượng user vào form
    this.userForm.patchValue({
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone,
      password: this.user.password,
      passwordConfirm: this.user.passwordConfirm,
      role: this.user.role,
      status: this.user.status
    });
  }

  private fb = inject(NonNullableFormBuilder);

  userForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    phone: this.fb.control('', [
      Validators.required,
      Validators.pattern(/^(0[3|5|7|8|9])+([0-9]{8})$/)
    ]),
    password: this.fb.control('', [Validators.required, Validators.minLength(6)]),
    passwordConfirm: this.fb.control('', [Validators.required, Validators.minLength(6)]),
    role: this.fb.control('user', Validators.required),
    status: this.fb.control('active', Validators.required)

  }, {
    validators: this.passwordMatchValidator
  }
  );

  passwordMatchValidator(control: any): any | null {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;

    if (password === passwordConfirm) {
      return null;
    }

    // Đặt lỗi cho trường passwordConfirm
    const passwordConfirmControl = control.get('passwordConfirm');
    if (passwordConfirmControl) {
      passwordConfirmControl.setErrors({ passwordMismatch: true });
    }

    return { passwordMismatch: true };
  }


  isConfirmLoading = false;

  handleOk(): void {
    if (this.userForm.valid) {
      this.isConfirmLoading = true;
      const formData: any = this.userForm.value;

      if (this.isEditMode && this.userData) {
        formData.id = this.userData.id;
      }

      setTimeout(() => {
        this.userSaved.emit(formData);
        this.isConfirmLoading = false;
        this.modalClosed.emit();
      }, 1000);
    } else {
      // Đánh dấu tất cả các trường là dirty để hiển thị lỗi
      Object.values(this.userForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
    }
  }

  handleCancel(): void {

    // Nếu đang trong trạng thái loading, hiển thị xác nhận
    if (this.isConfirmLoading) {
      const confirmExit = window.confirm('Dữ liệu đang được xử lý. Bạn có chắc chắn muốn hủy?');
      if (confirmExit) {
        // Ngừng mọi yêu cầu API nếu có
        // this.subscription?.unsubscribe();

        // Reset trạng thái
        this.isConfirmLoading = false;
        this.isVisible = false;
        this.userForm.reset();
      }
      // Nếu không xác nhận, giữ nguyên modal
    } else {
      // Nếu không phải trạng thái loading, đóng modal bình thường
      this.isVisible = false;
      this.userForm.reset();
    }
    this.modalClosed.emit();
  }

}
