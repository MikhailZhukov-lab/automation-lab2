"""Capture this project's saved UTF-8 CLI log in its own Windows terminal."""
import ctypes
import time
import win32api
import win32con
import win32gui
import win32process
import win32ui
from PIL import Image

startup = win32process.STARTUPINFO()
startup.dwFlags = 4
startup.dwX, startup.dwY = 2500, 100
title = f'Lab7 CLI log {int(time.time())}'
command = ('powershell.exe -NoProfile -NoExit -Command "'
           f'$Host.UI.RawUI.WindowTitle=\'{title}\'; '
           '[Console]::OutputEncoding = [Text.UTF8Encoding]::new(); '
           '[Console]::Write([IO.File]::ReadAllText(\'artifacts/test-run.txt\', [Text.Encoding]::UTF8))"')
process, thread, _, _ = win32process.CreateProcess(
    None, command, None, None, False, win32con.CREATE_NEW_CONSOLE,
    None, None, startup,
)
try:
    windows = []
    for _ in range(50):
        windows = []
        win32gui.EnumWindows(lambda hwnd, _: windows.append(hwnd)
                            if win32gui.GetWindowText(hwnd).startswith(title) else None, None)
        if windows:
            break
        time.sleep(.1)
    if not windows:
        raise RuntimeError('Own terminal window not found')
    hwnd = windows[0]
    time.sleep(1)
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    width, height = right-left, bottom-top
    dc = win32gui.GetWindowDC(hwnd)
    source = win32ui.CreateDCFromHandle(dc)
    memory = source.CreateCompatibleDC()
    bitmap = win32ui.CreateBitmap()
    bitmap.CreateCompatibleBitmap(source, width, height)
    memory.SelectObject(bitmap)
    if not ctypes.windll.user32.PrintWindow(hwnd, memory.GetSafeHdc(), 2):
        raise RuntimeError('Terminal capture failed')
    image = Image.frombuffer('RGB', (width, height), bitmap.GetBitmapBits(True), 'raw', 'BGRX', 0, 1)
    image.save('artifacts/terminal-native.png')
    win32gui.DeleteObject(bitmap.GetHandle())
    memory.DeleteDC()
    source.DeleteDC()
    win32gui.ReleaseDC(hwnd, dc)
finally:
    if windows:
        win32gui.PostMessage(windows[0], win32con.WM_CLOSE, 0, 0)
    try:
        win32api.TerminateProcess(process, 0)
    except Exception:
        pass
    process.Close()
    thread.Close()
