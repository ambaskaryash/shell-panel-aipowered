export interface CommandTestResult {
  command: string
  isSafe: boolean
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  warnings: string[]
  mockOutput?: string
  explanation: string
  alternatives?: string[]
  safeFlags?: string[]
}

export interface MockOutput {
  pattern: RegExp
  output: string
  examples?: string[]
}

export class CommandTester {
  private dangerousCommands = new Set([
    'rm', 'del', 'rmdir', 'format', 'fdisk', 'dd',
    'chmod', 'chown', 'chgrp', 'usermod', 'userdel',
    'shutdown', 'reboot', 'poweroff', 'halt',
    'iptables', 'ufw', 'firewall-cmd',
    'mount', 'umount', 'mkfs', 'fsck',
    'kill', 'killall', 'pkill', 'kill -9',
    'sudo', 'su', 'passwd'
  ])

  private dangerousFlags = new Set([
    '-rf', '-fr', '-r', '-f', '--force', '--no-preserve-root',
    '-y', '--yes', '--assume-yes', '--no-confirm'
  ])

  private mockOutputs: MockOutput[] = [
    {
      pattern: /^ls\s+/,
      output: `file1.txt  file2.js  documents/  pictures/  downloads/`,
      examples: ['ls -la', 'ls -lh', 'ls *.txt']
    },
    {
      pattern: /^find\s+/,
      output: `./documents/report.pdf
./pictures/vacation.jpg
./downloads/installer.sh`,
      examples: ['find . -name "*.txt"', 'find /home -type f']
    },
    {
      pattern: /^grep\s+/,
      output: `line 42: const result = data.filter(item => item.active)
line 156: return activeItems.length`,
      examples: ['grep -r "pattern" .', 'grep "error" log.txt']
    },
    {
      pattern: /^tar\s+/,
      output: `archive.tar.gz
file1.txt
file2.js
documents/`,
      examples: ['tar -xzvf archive.tar.gz', 'tar -czf backup.tar.gz folder/']
    },
    {
      pattern: /^curl\s+/,
      output: `HTTP/1.1 200 OK
Content-Type: application/json
{"status": "success", "data": {...}}`,
      examples: ['curl https://api.example.com', 'curl -X POST -d "data" url']
    },
    {
      pattern: /^git\s+/,
      output: `On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean`,
      examples: ['git status', 'git log --oneline', 'git diff HEAD~1']
    },
    {
      pattern: /^ps\s+/,
      output: `  PID TTY          TIME CMD
 1234 pts/0    00:00:00 bash
 5678 pts/0    00:00:01 node
 9012 pts/0    00:00:00 ps`,
      examples: ['ps aux', 'ps -ef | grep node']
    },
    {
      pattern: /^df\s+/,
      output: `Filesystem     1K-blocks    Used Available Use% Mounted on
/dev/sda1       10255636 3567096   6174468  37% /
tmpfs             816896       0    816896   0% /dev/shm`,
      examples: ['df -h', 'df -T']
    }
  ]

  testCommand(command: string): CommandTestResult {
    const trimmed = command.trim()
    if (!trimmed) {
      return {
        command: trimmed,
        isSafe: true,
        riskLevel: 'low',
        warnings: [],
        explanation: 'Empty command',
        alternatives: []
      }
    }

    const tokens = trimmed.split(/\s+/)
    const baseCommand = tokens[0].toLowerCase()
    
    const warnings: string[] = []
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
    let isSafe = true

    // Check for dangerous commands
    if (this.dangerousCommands.has(baseCommand)) {
      isSafe = false
      riskLevel = 'high'
      warnings.push(`⚠️ '${baseCommand}' can modify system files or settings`)
      
      if (baseCommand === 'rm') {
        riskLevel = 'critical'
        warnings.push('🚨 rm command can permanently delete files')
      }
    }

    // Check for dangerous flags
    tokens.forEach(token => {
      if (this.dangerousFlags.has(token)) {
        isSafe = false
        if (riskLevel === 'low') riskLevel = 'medium'
        warnings.push(`⚠️ Flag '${token}' may bypass safety checks`)
      }
    })

    // Check for wildcards that could affect many files
    if (tokens.some(token => token.includes('*') || token.includes('?'))) {
      warnings.push('ℹ️ Wildcard patterns may match more files than expected')
    }

    // Check for system paths
    const systemPaths = ['/etc/', '/usr/', '/var/', '/sys/', '/proc/', '/dev/']
    if (tokens.some(token => systemPaths.some(path => token.includes(path)))) {
      warnings.push('⚠️ Command affects system directories')
    }

    // Generate mock output
    const mockOutput = this.generateMockOutput(trimmed)

    return {
      command: trimmed,
      isSafe,
      riskLevel,
      warnings,
      mockOutput,
      explanation: this.generateExplanation(trimmed, baseCommand, isSafe),
      alternatives: this.generateAlternatives(baseCommand, tokens),
      safeFlags: this.getSafeFlags(baseCommand)
    }
  }

  private generateMockOutput(command: string): string | undefined {
    for (const mock of this.mockOutputs) {
      if (mock.pattern.test(command)) {
        return mock.output
      }
    }
    return undefined
  }

  private generateExplanation(command: string, baseCommand: string, isSafe: boolean): string {
    if (!isSafe) {
      return `This command (${baseCommand}) has potential risks. Consider using safer alternatives or testing in a controlled environment.`
    }
    
    const explanations: Record<string, string> = {
      'ls': 'Lists files and directories in the current location',
      'find': 'Searches for files and directories based on criteria',
      'grep': 'Searches for text patterns in files',
      'tar': 'Creates or extracts compressed archive files',
      'curl': 'Transfers data to/from URLs (safe for reading)',
      'git': 'Version control system commands',
      'ps': 'Shows running processes',
      'df': 'Shows disk space usage'
    }

    return explanations[baseCommand] || 'Standard system command for file and process operations'
  }

  private generateAlternatives(command: string, tokens: string[]): string[] {
    const base = tokens[0].toLowerCase()
    
    const alternatives: Record<string, string[]> = {
      'rm': [
        'Use trash-cli: `trash-put filename` (moves to trash)',
        'Use safe-rm: `safe-rm filename` (has built-in protections)',
        'Move to .trash directory: `mv filename ~/.trash/`'
      ],
      'find': [
        'Add -type f to only find files: `find . -type f -name "*.txt"`',
        'Use -print0 with xargs for safer handling'
      ],
      'chmod': [
        'Use symbolic modes: `chmod u+x script.sh` instead of numeric',
        'Check current permissions first: `ls -la filename`'
      ]
    }

    return alternatives[base] || []
  }

  private getSafeFlags(command: string): string[] {
    const safeFlags: Record<string, string[]> = {
      'ls': ['-la', '-lh', '-ltr', '-1'],
      'find': ['-type f', '-type d', '-name', '-iname'],
      'grep': ['-i', '-n', '-r', '-l'],
      'tar': ['-tzf', '-czf', '-xzf'],
      'curl': ['-I', '-s', '-L', '-o']
    }

    return safeFlags[command] || []
  }

  isCommandSafe(command: string): boolean {
    return this.testCommand(command).isSafe
  }

  getCommandWarnings(command: string): string[] {
    return this.testCommand(command).warnings
  }
}

export const commandTester = new CommandTester()
