// 假設小組員名單（可自行修改）
let members = JSON.parse(localStorage.getItem('members')) || ['張三', '李四', '王五'];

// 載入牧區和小組名稱
let district = localStorage.getItem('district') || '未設置';
let group = localStorage.getItem('group') || '未設置';
document.getElementById('district-name').textContent = district;
document.getElementById('group-name').textContent = group;

// 設置牧區和小組名稱
document.getElementById('set-group-info').addEventListener('click', () => {
    const newDistrict = prompt('請輸入牧區名稱：', district);
    const newGroup = prompt('請輸入小組名稱：', group);
    if (newDistrict && newGroup) {
        localStorage.setItem('district', newDistrict);
        localStorage.setItem('group', newGroup);
        document.getElementById('district-name').textContent = newDistrict;
        document.getElementById('group-name').textContent = newGroup;
    }
});

// 動態生成月份選項（最近3個月）
const monthSelect = document.getElementById('month-select');
const currentDate = new Date();
for (let i = -1; i <= 1; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    const month = date.toISOString().slice(0, 7); // 格式：YYYY-MM
    const option = document.createElement('option');
    option.value = month;
    option.text = month;
    monthSelect.appendChild(option);
}

// 動態生成小組員表格
const tableBody = document.querySelector('#care-table tbody');
members.forEach(member => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${member}</td>
        <td><input type="date" value="${new Date().toISOString().slice(0, 10)}"></td>
        <td>
            <select>
                <option value="！">！</option>
                <option value="△">△</option>
                <option value="○">○</option>
            </select>
        </td>
        <td>
            <label><input type="checkbox" value="守望禱告">守望禱告</label>
            <label><input type="checkbox" value="通話關懷">通話關懷</label>
            <label><input type="checkbox" value="LINE 關懷">LINE 關懷</label>
            <label><input type="checkbox" value="約見面">約見面</label>
            <label><input type="checkbox" value="陪讀">陪讀</label>
            <label><input type="checkbox" value="住院探訪">住院探訪</label>
            <label><input type="checkbox" value="沒有回應">沒有回應</label>
        </td>
        <td><input type="text"></td>
    `;
    tableBody.appendChild(row);
});

// 保存記錄並提交到後端
document.getElementById('save-button').addEventListener('click', () => {
    const month = monthSelect.value;
    const records = [];
    tableBody.querySelectorAll('tr').forEach(row => {
        const member = row.cells[0].textContent;
        const date = row.cells[1].querySelector('input').value;
        const symbol = row.cells[2].querySelector('select').value;
        const notes = Array.from(row.cells[3].querySelectorAll('input:checked')).map(cb => cb.value);
        const extra = row.cells[4].querySelector('input').value;
        records.push({ member, date, symbol, notes, extra });
    });
    // 保存到本地存儲
    localStorage.setItem(`records_${month}`, JSON.stringify(records));
    // 提交到後端（將 URL 替換為後端部署後的 Web App URL）
    fetch('https://script.google.com/macros/s/AKfycbyZDX5GR2QUvJ-wlbzsmY27mFHC1Wohkx5u6KlIywmE4JLs0dxQP-XQYmkiXdL2UQjd/execT_URLURL', {
        method: 'POST',
        body: JSON.stringify({ month, records }),
        headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json()).then(data => {
        alert('記錄已保存');
    }).catch(error => {
        alert('保存失敗，請檢查後端配置');
        console.error(error);
    });
});