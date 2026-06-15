from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session

from .. import crud
from ..database import get_db

router = APIRouter(tags=["admin"])


def render_admin_page(contacts):
    rows = ""
    for c in contacts:
        fabric_badge = ""
        if c.fabric_type:
            fabric_class = f"fabric-{c.fabric_type}"
            fabric_badge = f'<span class="fabric-badge {fabric_class}">{c.fabric_type}</span>'
        created = c.created_at.strftime("%d.%m.%Y %H:%M") if c.created_at else "—"
        rows += f"""<tr>
            <td>{c.id}</td>
            <td>{c.name}</td>
            <td>{c.phone}</td>
            <td>{c.address or '—'}</td>
            <td>{fabric_badge or '—'}</td>
            <td>{c.spotlight_count}</td>
            <td>{c.chandelier_count}</td>
            <td>{c.pipe_count}</td>
            <td>{c.corner_count}</td>
            <td>{c.description or '—'}</td>
            <td class="date">{created}</td>
        </tr>"""

    contacts_count = len(contacts)
    table_or_empty = f"""
    <div class="table-wrap"><table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Телефон</th>
                <th>Адрес</th>
                <th>Тип полотна</th>
                <th>Лампочки</th>
                <th>Люстры</th>
                <th>Трубы</th>
                <th>Углы</th>
                <th>Описание</th>
                <th>Дата</th>
            </tr>
        </thead>
        <tbody>{rows}</tbody>
    </table></div>
    """ if contacts else '<div class="no-contacts">Пока нет заявок</div>'

    return f"""<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Админ-панель | SamvelSite</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
            padding: 1rem;
        }}
        @media (min-width: 640px) {{ body {{ padding: 2rem; }} }}
        h1 {{ font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #f1f5f9; border-bottom: 1px solid #1e293b; padding-bottom: 0.75rem; }}
        @media (min-width: 640px) {{ h1 {{ font-size: 1.5rem; margin-bottom: 1.5rem; }} }}
        .nav {{ display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }}
        @media (min-width: 640px) {{ .nav {{ gap: 1rem; margin-bottom: 2rem; }} }}
        .nav a {{ color: #38bdf8; text-decoration: none; font-size: 0.75rem; padding: 0.4rem 0.75rem; border: 1px solid #334155; border-radius: 0.375rem; white-space: nowrap; }}
        @media (min-width: 640px) {{ .nav a {{ font-size: 0.875rem; padding: 0.5rem 1rem; }} }}
        .nav a:hover {{ background: #1e293b; }}
        .stats {{ display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }}
        @media (min-width: 640px) {{ .stats {{ gap: 1rem; margin-bottom: 2rem; }} }}
        .stat-card {{ background: #1e293b; border-radius: 0.5rem; padding: 0.75rem 1rem; border: 1px solid #334155; flex: 1; }}
        @media (min-width: 640px) {{ .stat-card {{ padding: 1rem 1.5rem; }} }}
        .stat-card .number {{ font-size: 1.5rem; font-weight: 700; color: #38bdf8; }}
        @media (min-width: 640px) {{ .stat-card .number {{ font-size: 1.75rem; }} }}
        .stat-card .label {{ font-size: 0.65rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }}
        @media (min-width: 640px) {{ .stat-card .label {{ font-size: 0.75rem; }} }}
        .table-wrap {{ overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 0 -1rem; padding: 0 1rem; }}
        @media (min-width: 640px) {{ .table-wrap {{ margin: 0; padding: 0; }} }}
        table {{ width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 0.5rem; overflow: hidden; border: 1px solid #334155; min-width: 700px; }}
        @media (min-width: 640px) {{ table {{ min-width: 0; }} }}
        th {{ text-align: left; padding: 0.5rem 0.6rem; background: #0f172a; color: #94a3b8; font-weight: 500; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #334155; white-space: nowrap; }}
        @media (min-width: 640px) {{ th {{ padding: 0.75rem 1rem; font-size: 0.75rem; }} }}
        td {{ padding: 0.5rem 0.6rem; border-bottom: 1px solid #1e293b; font-size: 0.75rem; color: #cbd5e1; white-space: nowrap; }}
        @media (min-width: 640px) {{ td {{ padding: 0.75rem 1rem; font-size: 0.875rem; }} }}
        tr:last-child td {{ border-bottom: none; }}
        tr:hover td {{ background: #334155; }}
        .fabric-badge {{ display: inline-block; padding: 0.125rem 0.4rem; border-radius: 9999px; font-size: 0.65rem; font-weight: 500; }}
        .fabric-satin {{ background: #1e3a5f; color: #93c5fd; }}
        .fabric-gloss {{ background: #3b2f2f; color: #fcd34d; }}
        .fabric-matte {{ background: #2d3b2d; color: #86efac; }}
        .no-contacts {{ text-align: center; padding: 2rem 1rem; color: #64748b; font-size: 0.875rem; }}
        @media (min-width: 640px) {{ .no-contacts {{ padding: 3rem; }} }}
        .date {{ white-space: nowrap; font-size: 0.7rem; color: #64748b; }}
    </style>
</head>
<body>
    <div class="nav">
        <a href="/admin">Заявки</a>
        <a href="/admin/works">Работы (галерея)</a>
    </div>
    <h1>Панель управления заявками</h1>
    <div class="stats">
        <div class="stat-card">
            <div class="number">{contacts_count}</div>
            <div class="label">Всего заявок</div>
        </div>
    </div>
    {table_or_empty}
</body>
</html>"""


def render_works_page(works):
    rows = ""
    for w in works:
        img_count = len(w.images)
        rows += f"""<tr>
            <td>{w.id}</td>
            <td>{w.title}</td>
            <td>{w.subtitle or '—'}</td>
            <td><span class="layout-badge">{w.layout}</span></td>
            <td>{img_count}</td>
            <td>{w.sort_order}</td>
            <td class="actions">
                <button class="btn-edit" data-id="{w.id}" data-title="{w.title}" data-subtitle="{w.subtitle or ''}" data-description="{w.description or ''}" data-layout="{w.layout}" data-sort="{w.sort_order}">✏️</button>
                <button class="btn-delete" data-id="{w.id}">🗑️</button>
            </td>
        </tr>"""

    return f"""<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Управление работами | SamvelSite</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; padding: 1rem; }}
        @media (min-width: 640px) {{ body {{ padding: 2rem; }} }}
        h1 {{ font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #f1f5f9; border-bottom: 1px solid #1e293b; padding-bottom: 0.75rem; }}
        @media (min-width: 640px) {{ h1 {{ font-size: 1.5rem; margin-bottom: 1.5rem; }} }}
        .nav {{ display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }}
        @media (min-width: 640px) {{ .nav {{ gap: 1rem; margin-bottom: 2rem; }} }}
        .nav a {{ color: #38bdf8; text-decoration: none; font-size: 0.75rem; padding: 0.4rem 0.75rem; border: 1px solid #334155; border-radius: 0.375rem; white-space: nowrap; }}
        @media (min-width: 640px) {{ .nav a {{ font-size: 0.875rem; padding: 0.5rem 1rem; }} }}
        .nav a:hover {{ background: #1e293b; }}
        .form-card {{ background: #1e293b; border: 1px solid #334155; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1.5rem; }}
        @media (min-width: 640px) {{ .form-card {{ padding: 1.5rem; margin-bottom: 2rem; }} }}
        .form-card h2 {{ font-size: 1rem; color: #f1f5f9; margin-bottom: 1rem; }}
        .form-row {{ display: grid; grid-template-columns: 1fr; gap: 0.75rem; margin-bottom: 0.75rem; }}
        @media (min-width: 640px) {{ .form-row {{ grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }} }}
        .form-row.three {{ grid-template-columns: 1fr; }}
        @media (min-width: 640px) {{ .form-row.three {{ grid-template-columns: 1fr 1fr 1fr; }} }}
        label {{ display: block; font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.05em; }}
        input, select, textarea {{ width: 100%; padding: 0.5rem 0.75rem; background: #0f172a; border: 1px solid #334155; border-radius: 0.375rem; color: #e2e8f0; font-size: 0.875rem; }}
        input:focus, select:focus, textarea:focus {{ outline: none; border-color: #38bdf8; }}
        textarea {{ resize: vertical; min-height: 60px; }}
        .btn {{ padding: 0.5rem 1rem; background: #38bdf8; color: #0f172a; border: none; border-radius: 0.375rem; font-weight: 600; cursor: pointer; }}
        .btn:hover {{ background: #7dd3fc; }}
        .btn-danger {{ background: #ef4444; color: white; }}
        .btn-danger:hover {{ background: #f87171; }}
        .table-wrap {{ overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 0 -1rem; padding: 0 1rem; }}
        @media (min-width: 640px) {{ .table-wrap {{ margin: 0; padding: 0; }} }}
        table {{ width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 0.5rem; overflow: hidden; border: 1px solid #334155; min-width: 600px; }}
        @media (min-width: 640px) {{ table {{ min-width: 0; }} }}
        th {{ text-align: left; padding: 0.5rem 0.6rem; background: #0f172a; color: #94a3b8; font-weight: 500; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #334155; white-space: nowrap; }}
        @media (min-width: 640px) {{ th {{ padding: 0.75rem 1rem; font-size: 0.75rem; }} }}
        td {{ padding: 0.5rem 0.6rem; border-bottom: 1px solid #1e293b; font-size: 0.75rem; color: #cbd5e1; white-space: nowrap; }}
        @media (min-width: 640px) {{ td {{ padding: 0.75rem 1rem; font-size: 0.875rem; }} }}
        tr:last-child td {{ border-bottom: none; }}
        tr:hover td {{ background: #334155; }}
        .layout-badge {{ display: inline-block; padding: 0.125rem 0.4rem; border-radius: 9999px; font-size: 0.65rem; background: #1e3a5f; color: #93c5fd; }}
        @media (min-width: 640px) {{ .layout-badge {{ font-size: 0.75rem; padding: 0.125rem 0.5rem; }} }}
        .actions {{ white-space: nowrap; }}
        .actions button {{ background: none; border: none; cursor: pointer; font-size: 1rem; padding: 0.25rem; }}
        .hidden {{ display: none; }}
        #edit-id {{ color: #94a3b8; font-size: 0.875rem; }}
        .upload-section {{ margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #334155; }}
        .upload-section input[type=file] {{ font-size: 0.875rem; color: #94a3b8; }}
        .image-list {{ display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }}
        .image-item {{ position: relative; width: 80px; height: 80px; border-radius: 0.375rem; overflow: hidden; border: 1px solid #334155; }}
        .image-item img {{ width: 100%; height: 100%; object-fit: cover; }}
        .image-item .del {{ position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; cursor: pointer; line-height: 20px; text-align: center; }}
        .no-items {{ text-align: center; padding: 3rem; color: #64748b; }}
        .msg {{ padding: 0.5rem 1rem; border-radius: 0.375rem; margin-bottom: 1rem; font-size: 0.875rem; }}
        .msg-success {{ background: #065f46; color: #6ee7b7; }}
        .msg-error {{ background: #7f1d1d; color: #fca5a5; }}
    </style>
</head>
<body>
    <div class="nav">
        <a href="/admin">Заявки</a>
        <a href="/admin/works">Работы (галерея)</a>
    </div>
    <h1>Управление галереей</h1>

    <div id="msg" class="hidden"></div>

    <div class="form-card">
        <h2 id="form-title">Новая работа</h2>
        <input type="hidden" id="edit-id" value="">
        <div class="form-row">
            <div>
                <label>Название *</label>
                <input type="text" id="work-title" placeholder="Матовый потолок" required>
            </div>
            <div>
                <label>Подзаголовок</label>
                <input type="text" id="work-subtitle" placeholder="Гостиная 28м²">
            </div>
        </div>
        <div class="form-row">
            <div>
                <label>Описание</label>
                <textarea id="work-description" placeholder="Классическое матовое покрытие без бликов"></textarea>
            </div>
        </div>
        <div class="form-row three">
            <div>
                <label>Тип макета</label>
                <select id="work-layout">
                    <option value="wide">Wide</option>
                    <option value="tall">Tall</option>
                    <option value="square">Square</option>
                    <option value="photo">Photo (с фото)</option>
                </select>
            </div>
            <div>
                <label>Порядок</label>
                <input type="number" id="work-sort" value="0" min="0">
            </div>
            <div>
                <label>&nbsp;</label>
                <button class="btn" id="save-btn" onclick="saveWork()">Сохранить</button>
                <button class="btn btn-danger hidden" id="cancel-btn" onclick="cancelEdit()" style="margin-left:0.5rem">Отмена</button>
            </div>
        </div>

        <!-- Upload images section (shown when editing) -->
        <div id="upload-section" class="upload-section hidden">
            <label>Фотографии для этого коллажа</label>
            <input type="file" id="file-input" accept="image/*" multiple>
            <button class="btn" onclick="uploadImages()" style="margin-top:0.5rem">Загрузить</button>
            <div id="image-list" class="image-list"></div>
        </div>
    </div>

    <div class="table-wrap"><table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Подзаголовок</th>
                <th>Макет</th>
                <th>Фото</th>
                <th>Порядок</th>
                <th>Действия</th>
            </tr>
        </thead>
        <tbody id="works-tbody">
            {rows}
        </tbody>
    </table></div>

    <script>
        let currentWorkId = null;

        function showMsg(text, type) {{
            const el = document.getElementById('msg');
            el.textContent = text;
            el.className = 'msg msg-' + type;
            el.classList.remove('hidden');
            setTimeout(() => el.classList.add('hidden'), 3000);
        }}

        async function saveWork() {{
            const title = document.getElementById('work-title').value.trim();
            if (!title) {{ showMsg('Введите название', 'error'); return; }}
            const id = document.getElementById('edit-id').value;
            const body = {{
                title,
                subtitle: document.getElementById('work-subtitle').value.trim(),
                description: document.getElementById('work-description').value.trim(),
                layout: document.getElementById('work-layout').value,
                sort_order: parseInt(document.getElementById('work-sort').value) || 0,
            }};
            try {{
                let res;
                if (id) {{
                    res = await fetch('/api/works/' + id, {{ method: 'PUT', headers: {{ 'Content-Type': 'application/json' }}, body: JSON.stringify(body) }});
                }} else {{
                    res = await fetch('/api/works/', {{ method: 'POST', headers: {{ 'Content-Type': 'application/json' }}, body: JSON.stringify(body) }});
                }}
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                showMsg(id ? 'Работа обновлена' : 'Работа создана', 'success');
                cancelEdit();
                location.reload();
            }} catch (e) {{
                showMsg('Ошибка: ' + e.message, 'error');
            }}
        }}

        function editWork(btn) {{
            const id = btn.dataset.id;
            document.getElementById('edit-id').value = id;
            document.getElementById('work-title').value = btn.dataset.title;
            document.getElementById('work-subtitle').value = btn.dataset.subtitle;
            document.getElementById('work-description').value = btn.dataset.description;
            document.getElementById('work-layout').value = btn.dataset.layout;
            document.getElementById('work-sort').value = btn.dataset.sort;
            document.getElementById('form-title').textContent = 'Редактирование #' + id;
            document.getElementById('save-btn').textContent = 'Обновить';
            document.getElementById('cancel-btn').classList.remove('hidden');
            currentWorkId = id;
            loadImages(id);
        }}

        function cancelEdit() {{
            document.getElementById('edit-id').value = '';
            document.getElementById('work-title').value = '';
            document.getElementById('work-subtitle').value = '';
            document.getElementById('work-description').value = '';
            document.getElementById('work-layout').value = 'wide';
            document.getElementById('work-sort').value = '0';
            document.getElementById('form-title').textContent = 'Новая работа';
            document.getElementById('save-btn').textContent = 'Сохранить';
            document.getElementById('cancel-btn').classList.add('hidden');
            document.getElementById('upload-section').classList.add('hidden');
            document.getElementById('image-list').innerHTML = '';
            currentWorkId = null;
        }}

        async function deleteWork(btn) {{
            if (!confirm('Удалить эту работу?')) return;
            const id = btn.dataset.id;
            try {{
                const res = await fetch('/api/works/' + id, {{ method: 'DELETE' }});
                if (!res.ok) throw new Error(await res.text());
                showMsg('Работа удалена', 'success');
                location.reload();
            }} catch (e) {{
                showMsg('Ошибка: ' + e.message, 'error');
            }}
        }}

        async function loadImages(workId) {{
            const section = document.getElementById('upload-section');
            const list = document.getElementById('image-list');
            section.classList.remove('hidden');
            list.innerHTML = 'Загрузка...';
            try {{
                const res = await fetch('/api/works/' + workId);
                const data = await res.json();
                if (data.images && data.images.length > 0) {{
                    list.innerHTML = data.images.map(img => `
                        <div class="image-item">
                            <img src="${{img.url}}" alt="photo">
                            <button class="del" onclick="deleteImage(${{img.id}}, this)">×</button>
                        </div>
                    `).join('');
                }} else {{
                    list.innerHTML = '<div style="color:#64748b;font-size:0.875rem">Нет фотографий</div>';
                }}
            }} catch (e) {{
                list.innerHTML = '<div style="color:#fca5a5;font-size:0.875rem">Ошибка загрузки</div>';
            }}
        }}

        async function uploadImages() {{
            const input = document.getElementById('file-input');
            if (!currentWorkId || !input.files.length) return;
            const formData = new FormData();
            for (const file of input.files) {{
                formData.append('file', file);
            }}
            try {{
                const res = await fetch('/api/works/' + currentWorkId + '/images', {{ method: 'POST', body: formData }});
                if (!res.ok) throw new Error(await res.text());
                showMsg('Фото загружены', 'success');
                input.value = '';
                loadImages(currentWorkId);
            }} catch (e) {{
                showMsg('Ошибка: ' + e.message, 'error');
            }}
        }}

        async function deleteImage(imageId, btn) {{
            if (!confirm('Удалить фото?')) return;
            try {{
                const res = await fetch('/api/works/images/' + imageId, {{ method: 'DELETE' }});
                if (!res.ok) throw new Error(await res.text());
                btn.closest('.image-item').remove();
                showMsg('Фото удалено', 'success');
            }} catch (e) {{
                showMsg('Ошибка: ' + e.message, 'error');
            }}
        }}

        // Attach click handlers to dynamically rendered buttons
        document.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', () => editWork(b)));
        document.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', () => deleteWork(b)));
    </script>
</body>
</html>"""


@router.get("/admin", response_class=HTMLResponse)
def admin_panel(request: Request, db: Session = Depends(get_db)):
    contacts = crud.get_contacts(db)
    return HTMLResponse(content=render_admin_page(contacts))


@router.get("/admin/works", response_class=HTMLResponse)
def admin_works(request: Request, db: Session = Depends(get_db)):
    from ..crud import get_works
    works = get_works(db)
    return HTMLResponse(content=render_works_page(works))