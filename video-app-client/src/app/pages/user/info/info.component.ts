import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-info',
    imports: [CommonModule, FormsModule],
    templateUrl: './info.component.html',
    styleUrl: './info.component.scss',
})
export class InfoComponent {
    user = {
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
        photos: [
            'https://picsum.photos/seed/1/200',
            'https://picsum.photos/seed/2/200',
            'https://picsum.photos/seed/3/200',
            'https://picsum.photos/seed/4/200',
            'https://picsum.photos/seed/5/200',
        ],
    };

    videoList = [
        {
            title: 'Giới thiệu Angular cơ bản',
            channel: 'Học Lập Trình',
            views: '150K',
            uploaded: '1 tuần trước',
            thumbnail: 'https://i.ytimg.com/vi/abc123/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=1',
        },
        {
            title: 'Học TypeScript trong 30 phút',
            channel: 'Code Lý Thuyết & Thực Hành',
            views: '200K',
            uploaded: '2 tuần trước',
            thumbnail: 'https://i.ytimg.com/vi/def456/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=2',
        },
        {
            title: 'ReactJS từ cơ bản đến nâng cao',
            channel: 'Frontend VN',
            views: '300K',
            uploaded: '3 ngày trước',
            thumbnail: 'https://i.ytimg.com/vi/ghi789/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=3',
        },
        {
            title: 'NodeJS cho người mới bắt đầu',
            channel: 'Backend Pro',
            views: '120K',
            uploaded: '5 ngày trước',
            thumbnail: 'https://i.ytimg.com/vi/jkl012/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=4',
        },
        {
            title: 'Xây dựng API với NestJS',
            channel: 'Lập Trình Cùng Nam',
            views: '80K',
            uploaded: '1 tháng trước',
            thumbnail: 'https://i.ytimg.com/vi/mno345/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=5',
        },
        {
            title: 'Hướng dẫn sử dụng Git và GitHub',
            channel: 'Tech Tips VN',
            views: '250K',
            uploaded: '2 tháng trước',
            thumbnail: 'https://i.ytimg.com/vi/pqr678/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=6',
        },
        {
            title: 'CSS Grid vs Flexbox - Khi nào dùng?',
            channel: 'Design Dev',
            views: '95K',
            uploaded: '1 tuần trước',
            thumbnail: 'https://i.ytimg.com/vi/vid007/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=7',
        },
        {
            title: 'Tạo ứng dụng TODO bằng React',
            channel: 'Code Cafe',
            views: '180K',
            uploaded: '4 ngày trước',
            thumbnail: 'https://i.ytimg.com/vi/vid008/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=8',
        },
        {
            title: 'Vue 3 Composition API là gì?',
            channel: 'VueJS Việt Nam',
            views: '110K',
            uploaded: '3 tuần trước',
            thumbnail: 'https://i.ytimg.com/vi/vid009/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=9',
        },
        {
            title: 'Cách hoạt động của JavaScript Engine',
            channel: 'JS Insight',
            views: '140K',
            uploaded: '2 tuần trước',
            thumbnail: 'https://i.ytimg.com/vi/vid010/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=10',
        },
        {
            title: 'So sánh MySQL và MongoDB',
            channel: 'Database Talk',
            views: '60K',
            uploaded: '1 tháng trước',
            thumbnail: 'https://i.ytimg.com/vi/vid011/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=11',
        },
        {
            title: 'REST API vs GraphQL - Nên chọn gì?',
            channel: 'API School',
            views: '90K',
            uploaded: '3 tuần trước',
            thumbnail: 'https://i.ytimg.com/vi/vid012/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=12',
        },
        {
            title: 'Tìm hiểu về WebSocket',
            channel: 'Realtime Dev',
            views: '55K',
            uploaded: '6 ngày trước',
            thumbnail: 'https://i.ytimg.com/vi/vid013/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=13',
        },
        {
            title: 'Deploy app với Vercel & Netlify',
            channel: 'Deploy Master',
            views: '130K',
            uploaded: '5 tuần trước',
            thumbnail: 'https://i.ytimg.com/vi/vid014/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=14',
        },
        {
            title: 'Tạo ứng dụng chat bằng Socket.io',
            channel: 'Code Thực Chiến',
            views: '170K',
            uploaded: '2 tuần trước',
            thumbnail: 'https://i.ytimg.com/vi/vid015/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=15',
        },
        {
            title: 'Tối ưu hóa hiệu suất web',
            channel: 'Speed Up Dev',
            views: '85K',
            uploaded: '4 tuần trước',
            thumbnail: 'https://i.ytimg.com/vi/vid016/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=16',
        },
        {
            title: 'Authentication với JWT',
            channel: 'Security 101',
            views: '190K',
            uploaded: '1 tháng trước',
            thumbnail: 'https://i.ytimg.com/vi/vid017/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=17',
        },
        {
            title: 'Viết Unit Test trong JavaScript',
            channel: 'Test Driven Dev',
            views: '75K',
            uploaded: '2 ngày trước',
            thumbnail: 'https://i.ytimg.com/vi/vid018/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=18',
        },
        {
            title: 'Xử lý form trong Angular',
            channel: 'Angular Pro',
            views: '100K',
            uploaded: '3 ngày trước',
            thumbnail: 'https://i.ytimg.com/vi/vid019/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=19',
        },
        {
            title: 'Tạo theme dark/light bằng Tailwind CSS',
            channel: 'UI Dev',
            views: '145K',
            uploaded: '1 tuần trước',
            thumbnail: 'https://i.ytimg.com/vi/vid020/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=20',
        },
        {
            title: 'Khóa học lập trình Python cho người mới',
            channel: 'Code Python',
            views: '320K',
            uploaded: '3 tháng trước',
            thumbnail: 'https://i.ytimg.com/vi/vid021/hqdefault.jpg',
            channelAvatar: 'https://i.pravatar.cc/40?img=21',
        },
    ];

    showEditModal = false;
    editFullName = this.user.fullName;
    editEmail = this.user.email;

    saveChanges() {
        this.user.fullName = this.editFullName;
        this.user.email = this.editEmail;
        this.showEditModal = false;
    }
}
