import React, { useState } from 'react'
import { Book, Search, Copy, Play, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CommandTemplate, commandTemplateManager } from '@/lib/command-templates'

interface CommandTemplatesProps {
  onUseTemplate?: (command: string) => void
}

export function CommandTemplates({ onUseTemplate }: CommandTemplatesProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTemplate, setSelectedTemplate] = useState<CommandTemplate | null>(null)
  const [parameters, setParameters] = useState<Record<string, string>>({})

  const templates = commandTemplateManager.getTemplates()
  const categories = ['all', ...commandTemplateManager.getCategories()]
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchTerm === '' || 
                         commandTemplateManager.searchTemplates(searchTerm).includes(template)
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const handleUseTemplate = (template: CommandTemplate) => {
    const command = commandTemplateManager.generateCommand(template, parameters)
    onUseTemplate?.(command)
    setSelectedTemplate(null)
    setParameters({})
  }

  const handleParameterChange = (name: string, value: string) => {
    setParameters(prev => ({ ...prev, [name]: value }))
  }

  const getCommandPreview = (template: CommandTemplate) => {
    let command = template.command
    Object.entries(parameters).forEach(([key, value]) => {
      const placeholder = `{${key}}`
      command = command.replace(placeholder, value || `{${key}}`)
    })
    return command
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Command Templates</CardTitle>
        <CardDescription>
          Pre-built, safe commands for common use cases
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Templates List */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <Badge 
                      variant={template.safe ? "success" : "secondary"}
                      className="text-xs"
                    >
                      {template.safe ? 'Safe' : 'Caution'}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="bg-muted p-2 rounded font-mono text-sm">
                    <code>{template.command}</code>
                  </div>

                  <div className="flex gap-2">
                    <Button
                    size="sm"
                    onClick={() => setSelectedTemplate(template)}
                    className="h-10 touch-target"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUseTemplate?.(template.command)}
                    className="h-10 touch-target"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* Template Parameters Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>{selectedTemplate.name}</CardTitle>
                <CardDescription>{selectedTemplate.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTemplate.parameters.map(param => (
                  <div key={param.name} className="space-y-2">
                    <label className="text-sm font-medium">
                      {param.name} {param.required && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      placeholder={param.description}
                      value={parameters[param.name] || param.defaultValue || ''}
                      onChange={(e) => handleParameterChange(param.name, e.target.value)}
                    />
                    {param.examples && (
                      <p className="text-xs text-muted-foreground">
                        Examples: {param.examples.join(', ')}
                      </p>
                    )}
                  </div>
                ))}

                <div className="bg-muted p-3 rounded">
                  <p className="text-sm font-medium mb-1">Preview:</p>
                  <code className="text-sm font-mono">
                    {getCommandPreview(selectedTemplate)}
                  </code>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUseTemplate(selectedTemplate)}
                    className="flex-1"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Use Command
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedTemplate(null)
                      setParameters({})
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Book className="w-12 h-12 mx-auto mb-2" />
            <p>No templates found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}