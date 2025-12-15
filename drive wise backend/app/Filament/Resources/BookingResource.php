<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BookingResource\Pages;
use App\Models\Booking;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Resources\Resource;

class BookingResource extends Resource
{
    protected static ?string $model = Booking::class;
    protected static ?string $navigationIcon = 'heroicon-o-collection';
    protected static ?string $navigationLabel = 'Bookings';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\BelongsToSelect::make('user_id')
                ->relationship('user','name')
                ->searchable()
                ->required(),

            Forms\Components\BelongsToSelect::make('car_id')
                ->relationship('car','name')
                ->searchable()
                ->required(),

            Forms\Components\DatePicker::make('start_date')->required(),
            Forms\Components\DatePicker::make('end_date')->required(),
            Forms\Components\TextInput::make('days')->numeric()->disabled(),
            Forms\Components\TextInput::make('total_price')->numeric()->disabled(),
            Forms\Components\Select::make('status')
                ->options([
                    'pending'=>'Pending',
                    'approved'=>'Approved',
                    'declined'=>'Declined',
                    'out'=>'Out',
                    'returned'=>'Returned',
                    'cancelled'=>'Cancelled',
                ]),
            Forms\Components\Textarea::make('notes'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('id'),
            Tables\Columns\TextColumn::make('user.name')->label('Customer')->searchable(),
            Tables\Columns\TextColumn::make('car.name')->label('Car')->searchable(),
            Tables\Columns\TextColumn::make('start_date')->date(),
            Tables\Columns\TextColumn::make('end_date')->date(),
            Tables\Columns\TextColumn::make('days'),
            Tables\Columns\TextColumn::make('total_price')->money('KES'),
            Tables\Columns\BadgeColumn::make('status')->colors([
                'warning'=>'pending',
                'success'=>'approved',
                'danger'=>'declined',
                'info'=>'out',
                'primary'=>'returned',
                'secondary'=>'cancelled',
            ]),
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
            'index' => Pages\ListBookings::route('/'),
            'create' => Pages\CreateBooking::route('/create'),
            'edit' => Pages\EditBooking::route('/{record}/edit'),
        ];
    }
}
