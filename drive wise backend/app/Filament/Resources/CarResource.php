<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CarResource\Pages;
use App\Models\Car;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Resources\Resource;

class CarResource extends Resource
{
    protected static ?string $model = Car::class;
    protected static ?string $navigationIcon = 'heroicon-o-car';
    protected static ?string $navigationLabel = 'Cars';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('name')->required(),
            Forms\Components\TextInput::make('brand'),
            Forms\Components\TextInput::make('model'),
            Forms\Components\TextInput::make('year'),
            Forms\Components\TextInput::make('seats')->numeric(),
            Forms\Components\Select::make('gear_type')
                ->options([
                    'Automatic' => 'Automatic',
                    'Manual' => 'Manual',
                ]),
            Forms\Components\Select::make('fuel_type')
                ->options([
                    'Petrol' => 'Petrol',
                    'Diesel' => 'Diesel',
                    'Electric' => 'Electric',
                ]),
            Forms\Components\TextInput::make('daily_price')
                ->numeric()
                ->required(),
            Forms\Components\Textarea::make('description'),
            Forms\Components\FileUpload::make('images')
                ->image()
                ->multiple(),
            Forms\Components\Toggle::make('active')
                ->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\ImageColumn::make('images.0')->label('Image'),
            Tables\Columns\TextColumn::make('name')->searchable()->sortable(),
            Tables\Columns\TextColumn::make('brand'),
            Tables\Columns\TextColumn::make('daily_price')->money('KES'),
            Tables\Columns\IconColumn::make('active')->boolean(),
            Tables\Columns\TextColumn::make('created_at')->dateTime(),
        ])
        ->filters([])
        ->actions([
            Tables\Actions\EditAction::make(),
            Tables\Actions\DeleteAction::make(),
        ])
        ->bulkActions([
            Tables\Actions\DeleteBulkAction::make(),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCars::route('/'),
            'create' => Pages\CreateCar::route('/create'),
            'edit' => Pages\EditCar::route('/{record}/edit'),
        ];
    }
}
