/**
 * Custom Code Tool for EditorJS with Language Selection
 */

interface CodeToolData {
    code: string;
    language?: string;
}

interface CodeToolConfig {
    placeholder?: string;
}

export default class CustomCodeTool {
    private api: any;
    private data: CodeToolData;
    private config: CodeToolConfig;
    private wrapper: HTMLElement | null = null;

    static get isInline() {
        return false;
    }

    static get toolbox() {
        return {
            title: 'Code',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
        };
    }

    constructor({ data, config, api }: { data: CodeToolData; config?: CodeToolConfig; api: any }) {
        this.data = data || { code: '', language: 'plaintext' };
        this.config = config || {};
        this.api = api;

        // Add global styles for select options if not already added
        if (!document.getElementById('code-tool-styles')) {
            const style = document.createElement('style');
            style.id = 'code-tool-styles';
            style.textContent = `
                .code-tool-language-select {
                    appearance: none;
                    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                    background-repeat: no-repeat;
                    background-position: right 8px center;
                    background-size: 1.5em 1.5em;
                    padding-right: 2.5rem;
                }
                .code-tool-language-select option {
                    background-color: #fff;
                    color: #333;
                    padding: 8px;
                }
                .code-tool-language-select option:checked {
                    background: linear-gradient(#3b82f6, #3b82f6);
                    background-color: #3b82f6 !important;
                    color: white !important;
                }
                .code-tool-language-select option:hover {
                    background-color: #e5e7eb;
                }
                @media (prefers-color-scheme: dark) {
                    .code-tool-language-select option {
                        background-color: #1f2937;
                        color: #e2e8f0;
                    }
                    .code-tool-language-select option:checked {
                        background: linear-gradient(#3b82f6, #3b82f6);
                        background-color: #3b82f6 !important;
                        color: white !important;
                    }
                    .code-tool-language-select option:hover {
                        background-color: #374151;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    private isDarkMode(): boolean {
        if (typeof window === 'undefined') return true;
        return document.documentElement.classList.contains('dark') || 
               window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    private getThemeStyles() {
        const isDark = this.isDarkMode();
        return {
            labelColor: isDark ? '#888' : '#999',
            borderColor: isDark ? '#333' : '#444',
            borderColorHover: isDark ? '#555' : '#666',
            selectBg: '#1a1a1a',
            selectColor: '#ffffff',
            selectFocusColor: '#3b82f6',
            textareaBg: '#0f172a',
            textareaColor: '#e2e8f0',
            textareaPlaceholder: '#666',
        };
    }

    render() {
        const theme = this.getThemeStyles();
        
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'code-tool-wrapper';
        this.wrapper.style.cssText = `
            display: block;
            width: 100%;
        `;

        // Language selector container
        const languageContainer = document.createElement('div');
        languageContainer.className = 'code-tool-language-container';
        languageContainer.style.cssText = `
            display: inline-flex;
            gap: 8px;
            margin-bottom: 16px;
            align-items: center;
            position: relative;
            z-index: 10;
        `;

        const languageLabel = document.createElement('label');
        languageLabel.textContent = 'Language:';
        languageLabel.style.cssText = `
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: ${theme.labelColor};
            white-space: nowrap;
        `;

        const languageSelect = document.createElement('select');
        languageSelect.className = 'code-tool-language-select';
        languageSelect.style.cssText = `
            padding: 6px 10px;
            border: 1px solid ${theme.borderColor};
            border-radius: 6px;
            font-size: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: ${theme.selectBg};
            color: ${theme.selectColor};
            cursor: pointer;
            min-width: 120px;
            transition: all 0.2s ease;
            position: relative;
            z-index: 1000;
        `;

        const languages = [
            { value: 'plaintext', label: 'Plain Text' },
            { value: 'javascript', label: 'JavaScript' },
            { value: 'typescript', label: 'TypeScript' },
            { value: 'jsx', label: 'JSX' },
            { value: 'tsx', label: 'TSX' },
            { value: 'python', label: 'Python' },
            { value: 'java', label: 'Java' },
            { value: 'cpp', label: 'C++' },
            { value: 'csharp', label: 'C#' },
            { value: 'php', label: 'PHP' },
            { value: 'ruby', label: 'Ruby' },
            { value: 'go', label: 'Go' },
            { value: 'rust', label: 'Rust' },
            { value: 'sql', label: 'SQL' },
            { value: 'bash', label: 'Bash' },
            { value: 'shell', label: 'Shell' },
            { value: 'html', label: 'HTML' },
            { value: 'css', label: 'CSS' },
            { value: 'scss', label: 'SCSS' },
            { value: 'json', label: 'JSON' },
            { value: 'yaml', label: 'YAML' },
            { value: 'xml', label: 'XML' },
            { value: 'markdown', label: 'Markdown' },
            { value: 'git', label: 'Git' },
        ];

        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.value;
            option.textContent = lang.label;
            if (lang.value === (this.data.language || 'plaintext')) {
                option.selected = true;
            }
            languageSelect.appendChild(option);
        });

        languageSelect.addEventListener('change', (e) => {
            this.data.language = (e.target as HTMLSelectElement).value;
        });

        // Add hover effect
        languageSelect.addEventListener('mouseover', () => {
            languageSelect.style.borderColor = theme.borderColorHover;
        });

        languageSelect.addEventListener('mouseout', () => {
            languageSelect.style.borderColor = theme.borderColor;
        });

        languageContainer.appendChild(languageLabel);
        languageContainer.appendChild(languageSelect);

        // Code textarea
        const codeInput = document.createElement('textarea');
        codeInput.className = 'code-tool-input';
        codeInput.value = this.data.code || '';
        codeInput.placeholder = this.config.placeholder || 'Enter your code here...';
        codeInput.spellcheck = false;
        codeInput.style.cssText = `
            display: block;
            width: 100%;
            height: 500px;
            padding: 16px;
            border: 1px solid ${theme.borderColor};
            border-radius: 12px;
            font-family: 'Fira Code', 'Monaco', 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.6;
            resize: vertical;
            background-color: ${theme.textareaBg};
            color: ${theme.textareaColor};
            transition: all 0.2s ease;
            box-sizing: border-box;
        `;

        // Style placeholder
        codeInput.style.setProperty('--placeholder-color', theme.textareaPlaceholder);

        // Add focus effect
        codeInput.addEventListener('focus', () => {
            codeInput.style.borderColor = theme.selectFocusColor;
            codeInput.style.boxShadow = `0 0 0 3px ${theme.selectFocusColor}25`;
        });

        codeInput.addEventListener('blur', () => {
            codeInput.style.borderColor = theme.borderColor;
            codeInput.style.boxShadow = 'none';
        });

        codeInput.addEventListener('input', (e) => {
            this.data.code = (e.target as HTMLTextAreaElement).value;
        });

        this.wrapper.appendChild(languageContainer);
        this.wrapper.appendChild(codeInput);

        return this.wrapper;
    }

    save() {
        return {
            code: this.data.code,
            language: this.data.language || 'plaintext',
        };
    }

    validate(savedData: CodeToolData) {
        return savedData.code.trim().length > 0;
    }
}
