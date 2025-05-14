import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Ant Design
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';




@Component({
  selector: 'app-user-form',
  imports: [NzButtonModule, NzModalModule, NzSelectModule, NzFormModule, NzInputModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnChanges {
  @Input() isVisible = false;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() userSaved = new EventEmitter<any>();


  user = {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'daotaohieu@gmail.com',
    phone: '0912345678',
    password: '123456',
    role: 'user',
    status: 'active'
  };

  ngOnChanges(changes: SimpleChanges): void {
    // Kiểm tra nếu isVisible đã thay đổi
    if (changes['isVisible'] && changes['isVisible'].currentValue) {
      this.showModal();
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
    role: this.fb.control('user', Validators.required),
    status: this.fb.control('active', Validators.required)
  });

  isConfirmLoading = false;

  handleOk(): void {
    // Kiểm tra form hợp lệ trước khi xử lý
    if (this.userForm.valid) {
      // Hiển thị trạng thái loading
      this.isConfirmLoading = true;
      // Giả lập API call (thay bằng service thực tế của bạn)
      setTimeout(() => {
        // Gửi dữ liệu form lên component cha
        this.userSaved.emit(this.userForm.value);

        // Đặt lại trạng thái loading
        this.isConfirmLoading = false;

        // Đóng modal
        this.isVisible = false;

        // Thông báo cho component cha biết modal đã đóng
        this.modalClosed.emit();

        // Reset form nếu cần
        this.userForm.reset();
      }, 1000); // Đặt timeout để giả lập API call
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
