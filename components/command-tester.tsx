import React from 'react'
import { AlertTriangle, Shield, CheckCircle, Info, Terminal } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { CommandTestResult } from '@/lib/command-tester'

interface CommandTesterProps {
  command: string
  onUseAlternative?: (command: string) => void
}

export function CommandTester({ command, onUseAlternative }: CommandTesterProps) {
  const [testResult, setTestResult] = React.useState<CommandTestResult | null>(null)
  const [showMockOutput, setShowMockOutput] = React.useState(false)

  React.useEffect(() => {
    if (command.trim()) {
      // Import dynamically to avoid SSR issues
      import('@/lib/command-tester').then(({ commandTester }) => {
        const result = commandTester.testCommand(command)
        setTestResult(result)
      })
    } else {
      setTestResult(null)
    }
  }, [command])

  if (!testResult) {
    return null
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="h-4 w-4" />
      case 'medium': return <AlertTriangle className="h-4 w-4" />
      case 'high': return <AlertTriangle className="h-4 w-4" />
      case 'critical': return <AlertTriangle className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Command Safety Check</CardTitle>
            <CardDescription>
              Analyzing command safety and providing testing environment
            </CardDescription>
          </div>
          <Badge className={getRiskColor(testResult.riskLevel)}>
            <div className="flex items-center gap-1">
              {getRiskIcon(testResult.riskLevel)}
              {testResult.riskLevel.toUpperCase()}
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Safety Status */}
        <div className="flex items-center gap-2">
          {testResult.isSafe ? (
            <>
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                Command appears safe for testing
              </span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">
                Potential risks detected - review warnings
              </span>
            </>
          )}
        </div>

        {/* Warnings */}
        {testResult.warnings.length > 0 && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Safety Warnings</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 space-y-1">
                {testResult.warnings.map((warning, index) => (
                  <li key={index} className="text-sm">{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Explanation */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">What this command does:</h4>
          <p className="text-sm text-muted-foreground">{testResult.explanation}</p>
        </div>

        {/* Mock Output */}
        {testResult.mockOutput && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Expected Output:</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMockOutput(!showMockOutput)}
              >
                {showMockOutput ? 'Hide' : 'Show'}
              </Button>
            </div>
            {showMockOutput && (
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                <Terminal className="h-4 w-4 mb-2" />
                <pre className="whitespace-pre-wrap">{testResult.mockOutput}</pre>
              </div>
            )}
          </div>
        )}

        {/* Alternatives */}
        {testResult.alternatives && testResult.alternatives.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Safer Alternatives:</h4>
            <div className="space-y-2">
              {testResult.alternatives.map((alt, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUseAlternative?.(alt.split('`')[1] || alt)}
                    className="font-mono text-xs"
                  >
                    Use
                  </Button>
                  <span className="text-sm text-muted-foreground">{alt}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safe Flags */}
        {testResult.safeFlags && testResult.safeFlags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Safe Flags:</h4>
            <div className="flex flex-wrap gap-1">
              {testResult.safeFlags.map((flag, index) => (
                <Badge key={index} variant="secondary" className="font-mono text-xs">
                  {flag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Testing Actions */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            disabled={!testResult.isSafe}
            title={testResult.isSafe ? "Run in safe environment" : "Resolve warnings first"}
          >
            Test in Safe Environment
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              import('@/lib/command-tester').then(({ commandTester }) => {
                const result = commandTester.testCommand(command)
                setTestResult(result)
              })
            }}
          >
            Re-analyze
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}