export interface CommandTemplate {
  id: string
  name: string
  description: string
  command: string
  category: string
  tags: string[]
  parameters: TemplateParameter[]
  examples: string[]
  safe: boolean
  complexity: 'simple' | 'moderate' | 'complex'
}

export interface TemplateParameter {
  name: string
  description: string
  required: boolean
  defaultValue?: string
  examples?: string[]
}

export class CommandTemplateManager {
  private templates: CommandTemplate[] = [
    {
      id: 'file-list',
      name: 'List Files',
      description: 'List files and directories with detailed information',
      command: 'ls -la {directory}',
      category: 'file-management',
      tags: ['files', 'listing', 'basic'],
      parameters: [
        {
          name: 'directory',
          description: 'Directory to list (optional)',
          required: false,
          defaultValue: '.',
          examples: ['.', '/home', '/var/log']
        }
      ],
      examples: [
        'ls -la',
        'ls -la /home/user',
        'ls -lah /var/log'
      ],
      safe: true,
      complexity: 'simple'
    },
    {
      id: 'find-files',
      name: 'Find Files',
      description: 'Find files by name, type, or content',
      command: 'find {directory} -name "{pattern}" -type {type}',
      category: 'file-management',
      tags: ['search', 'find', 'files'],
      parameters: [
        {
          name: 'directory',
          description: 'Directory to search in',
          required: true,
          defaultValue: '.',
          examples: ['.', '/home', '/var/www']
        },
        {
          name: 'pattern',
          description: 'File name pattern to search for',
          required: true,
          defaultValue: '*.txt',
          examples: ['*.txt', '*.log', 'config.*']
        },
        {
          name: 'type',
          description: 'File type (f=file, d=directory)',
          required: false,
          defaultValue: 'f',
          examples: ['f', 'd', 'l']
        }
      ],
      examples: [
        'find . -name "*.txt" -type f',
        'find /var/log -name "*.log" -type f',
        'find . -type d -name "node_modules"'
      ],
      safe: true,
      complexity: 'moderate'
    },
    {
      id: 'text-search',
      name: 'Search Text',
      description: 'Search for text patterns in files',
      command: 'grep -{flags} "{pattern}" {files}',
      category: 'text-processing',
      tags: ['search', 'text', 'grep'],
      parameters: [
        {
          name: 'pattern',
          description: 'Text pattern to search for',
          required: true,
          examples: ['error', 'TODO', 'function.*name']
        },
        {
          name: 'files',
          description: 'Files or directories to search in',
          required: true,
          defaultValue: '*.txt',
          examples: ['*.txt', '/var/log/*.log', '.']
        },
        {
          name: 'flags',
          description: 'Grep flags (i=case-insensitive, r=recursive, n=line numbers)',
          required: false,
          defaultValue: 'irn',
          examples: ['i', 'rn', 'irn']
        }
      ],
      examples: [
        'grep -rn "error" /var/log',
        'grep -i "TODO" *.js',
        'grep -n "function" app.js'
      ],
      safe: true,
      complexity: 'moderate'
    },
    {
      id: 'archive-extract',
      name: 'Extract Archive',
      description: 'Extract compressed archives (tar, zip, gzip)',
      command: 'tar -{action}vf {archive}',
      category: 'archive',
      tags: ['archive', 'extract', 'compression'],
      parameters: [
        {
          name: 'action',
          description: 'Action to perform (x=extract, c=create, t=list)',
          required: true,
          defaultValue: 'x',
          examples: ['x', 'c', 't']
        },
        {
          name: 'archive',
          description: 'Archive file name',
          required: true,
          examples: ['archive.tar.gz', 'backup.tar', 'files.zip']
        }
      ],
      examples: [
        'tar -xzvf archive.tar.gz',
        'tar -xvf backup.tar',
        'tar -tzvf archive.tar.gz'
      ],
      safe: true,
      complexity: 'simple'
    },
    {
      id: 'disk-usage',
      name: 'Check Disk Usage',
      description: 'Check disk space usage for files and directories',
      command: 'du -{flags} {path}',
      category: 'system',
      tags: ['disk', 'usage', 'space'],
      parameters: [
        {
          name: 'flags',
          description: 'Display flags (h=human-readable, s=summary, d=depth)',
          required: false,
          defaultValue: 'h',
          examples: ['h', 'sh', 'hd1']
        },
        {
          name: 'path',
          description: 'File or directory to check',
          required: false,
          defaultValue: '.',
          examples: ['.', '/home', '/var/log']
        }
      ],
      examples: [
        'du -h .',
        'du -sh /home/user',
        'du -h --max-depth=1 /var/log'
      ],
      safe: true,
      complexity: 'simple'
    },
    {
      id: 'process-list',
      name: 'List Processes',
      description: 'List running processes with detailed information',
      command: 'ps {flags}',
      category: 'system',
      tags: ['processes', 'system', 'monitoring'],
      parameters: [
        {
          name: 'flags',
          description: 'Display flags (aux=all processes, ef=full format)',
          required: false,
          defaultValue: 'aux',
          examples: ['aux', 'ef', 'aux | grep nginx']
        }
      ],
      examples: [
        'ps aux',
        'ps ef | grep node',
        'ps aux | head -20'
      ],
      safe: true,
      complexity: 'simple'
    },
    {
      id: 'network-test',
      name: 'Test Network Connection',
      description: 'Test network connectivity and DNS resolution',
      command: 'curl -{flags} {url}',
      category: 'network',
      tags: ['network', 'testing', 'curl'],
      parameters: [
        {
          name: 'flags',
          description: 'Curl flags (I=head request, s=silent, L=follow redirects)',
          required: false,
          defaultValue: 'I',
          examples: ['I', 'Is', 'IL']
        },
        {
          name: 'url',
          description: 'URL to test',
          required: true,
          examples: ['https://google.com', 'http://localhost:3000']
        }
      ],
      examples: [
        'curl -I https://google.com',
        'curl -s https://api.github.com',
        'curl -IL https://example.com'
      ],
      safe: true,
      complexity: 'simple'
    },
    {
      id: 'git-status',
      name: 'Git Status Check',
      description: 'Check the status of a Git repository',
      command: 'git {command}',
      category: 'version-control',
      tags: ['git', 'version-control', 'status'],
      parameters: [
        {
          name: 'command',
          description: 'Git command to run',
          required: false,
          defaultValue: 'status',
          examples: ['status', 'log --oneline', 'branch -a']
        }
      ],
      examples: [
        'git status',
        'git log --oneline',
        'git branch -a'
      ],
      safe: true,
      complexity: 'simple'
    }
  ]

  getTemplates(): CommandTemplate[] {
    return this.templates
  }

  getTemplatesByCategory(category: string): CommandTemplate[] {
    return this.templates.filter(template => template.category === category)
  }

  getTemplatesByTag(tag: string): CommandTemplate[] {
    return this.templates.filter(template => 
      template.tags.includes(tag.toLowerCase())
    )
  }

  searchTemplates(query: string): CommandTemplate[] {
    const queryLower = query.toLowerCase()
    return this.templates.filter(template =>
      template.name.toLowerCase().includes(queryLower) ||
      template.description.toLowerCase().includes(queryLower) ||
      template.command.toLowerCase().includes(queryLower) ||
      template.tags.some(tag => tag.toLowerCase().includes(queryLower))
    )
  }

  generateCommand(template: CommandTemplate, parameters: Record<string, string>): string {
    let command = template.command
    
    Object.entries(parameters).forEach(([key, value]) => {
      const placeholder = `{${key}}`
      command = command.replace(placeholder, value || '')
    })

    // Remove any remaining placeholders
    return command.replace(/\{[^}]+\}/g, '')
  }

  getTemplateById(id: string): CommandTemplate | undefined {
    return this.templates.find(template => template.id === id)
  }

  getCategories(): string[] {
    return Array.from(new Set(this.templates.map(t => t.category)))
  }

  getPopularTags(): string[] {
    const tagCount = new Map<string, number>()
    
    this.templates.forEach(template => {
      template.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1)
      })
    })

    return Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
  }
}

export const commandTemplateManager = new CommandTemplateManager()